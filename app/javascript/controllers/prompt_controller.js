import { Controller } from "stimulus"

import Requests from "../requests"

export default class extends Controller {
    static targets = [ "timer", "recordingButton", "playerContainer" ]

    mediaRecorder = null
    chunks = []

    connect() {
        this.updateTimerDisplay()

        if (this.audioAvailable) {
            this.requestMicrophoneAccess()
        } else {
            console.error("getUserMedia not supported")
        }
    }

    updateTimerDisplay() {
        this.timerTarget.textContent = this.formatRemainingTime()
    }

    formatRemainingTime() {
        const remainingTime = this.remainingTime
        const minutes = Math.floor( remainingTime / 60 ).toString()
        const seconds = (remainingTime % 60).toString()
        const paddedSeconds = seconds.padStart(2, '0')

        return `${minutes}:${paddedSeconds}`
    }

    requestMicrophoneAccess() {
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then( stream => {
            this.mediaRecorder = new MediaRecorder(stream)
            this.mediaRecorder.ondataavailable = ({ data }) => this.chunks.push(data)
            this.mediaRecorder.onstop = this.submitAudioRecording

            this.recordingButtonTarget.disabled = false
        })
        .catch( err => {
            console.error("The following getUserMedia error occurred: ", err)
        })
    }

    startRecording() {
        this.recordingButtonTarget.remove()
        
        this.mediaRecorder.start()
        console.log(this.mediaRecorder.state)

        this.intervalId = setInterval(() => {
            if (this.remainingTime) {
                this.remainingTime -= 1
                this.updateTimerDisplay()
            } else {
                clearInterval(this.intervalId)
                this.stopRecording()
            }
        }, 1000)
    }

    stopRecording = () => {
        this.mediaRecorder.stop()
        console.log(this.mediaRecorder.state)
    }

    submitAudioRecording = () => {
        const blob = new Blob(this.chunks, { 'type' : 'audio/ogg; codecs=opus' })
        const formData = new FormData()
        formData.append('audio', blob)

        Requests.submitAnswer(formData)
        .then( answer => this.createAudioPlayer(answer.audioUrl) )
    }

    createAudioPlayer = (audioUrl) => {
        const audioPlayer = document.createElement('audio')
        audioPlayer.controls = true
        audioPlayer.src = audioUrl

        this.playerContainerTarget.append(audioPlayer)
    }

    get remainingTime() {
        return parseInt(this.data.get("remainingTime"))
    }

    set remainingTime(newTime) {
        this.data.set("remainingTime", newTime)
    }

    get audioAvailable() {
        return navigator.mediaDevices && navigator.mediaDevices.getUserMedia 
    }
}
