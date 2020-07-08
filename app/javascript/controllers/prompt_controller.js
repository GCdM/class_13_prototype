import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "player" ]

  mediaRecorder = null
  chunks = []

  connect() {
    if (this.audioAvailable) {
      this.requestAudioRecording()
    } else {
      console.error("getUserMedia not supported")
    }
  }

  requestAudioRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then( stream => {
      this.mediaRecorder = new MediaRecorder(stream)
      this.mediaRecorder.start()
      console.log(this.mediaRecorder.state)
      
      this.mediaRecorder.ondataavailable = ({ data }) => this.chunks.push(data)
      this.mediaRecorder.onstop = this.createAudioPlayer
    })
    .catch( err => {
      console.error("The following getUserMedia error occurred: ", err)
    })
  }

  handleSubmit = (e) => {
    this.mediaRecorder.stop()
    console.log(this.mediaRecorder.state)
  }

  createAudioPlayer = () => {
    const blob = new Blob(this.chunks, { 'type' : 'audio/ogg; codecs=opus' })
    const formData = new FormData()
    formData.append('audio', blob)

    const csrfToken = document.querySelector('meta[name="csrf-token"]').content
    
    fetch('http://localhost:3000/answer', {
      method: 'POST',
      headers: {
        // 'Content-Type': 'multipart/formdata',
        'X-CSRF-Token': csrfToken,
      },
      body: formData,
    })
    .then( resp => {
      debugger
      // if (resp.ok) window.location = "localhost:3000/dashboard"
      return resp.json()
    })
    .then( answer => {
      const audioPlayer = document.createElement('audio')
      audioPlayer.controls = true
      audioPlayer.src = answer.audioUrl
      
      this.playerTarget.append(audioPlayer)
    })
  }

  get audioAvailable() {
    return navigator.mediaDevices && navigator.mediaDevices.getUserMedia 
  }
}
