import { Controller } from "stimulus"

import Requests from "../requests"

export default class extends Controller {
    static targets = [ "playerContainer", "timer" ]

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
        const remainingTime = parseInt(this.data.get("remainingTime"))
        const minutes = Math.floor( remainingTime / 60 ).toString()
        const seconds = (remainingTime % 60).toString()
        const paddedSeconds = seconds.padStart(2, '0')

        return `${minutes}:${paddedSeconds}`
    }

    requestMicrophoneAccess() {
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then( stream => {
            this.mediaRecorder = new MediaRecorder(stream)
            this.mediaRecorder.start()
            console.log(this.mediaRecorder.state)

            this.mediaRecorder.ondataavailable = ({ data }) => this.chunks.push(data)
            this.mediaRecorder.onstop = this.submitAudioRecording
        })
        .catch( err => {
            console.error("The following getUserMedia error occurred: ", err)
        })
    }

    handleSubmit = (e) => {
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
