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
    const audioURL = window.URL.createObjectURL(blob)
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content
        
    fetch('http://localhost:3000/answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'audio/ogg',
        'X-CSRF-Token': csrfToken,
      },
      body: blob,
    })
    // .then( r => {debugger} )
    
    const audio = document.createElement('audio')
    audio.controls = true
    this.playerTarget.append(audio)

    audio.src = audioURL
  }

  get audioAvailable() {
    return navigator.mediaDevices && navigator.mediaDevices.getUserMedia 
  }
}
