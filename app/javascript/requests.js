const BASE_URL = 'http://localhost:3000'

const CSRFToken = () => document.querySelector('meta[name="csrf-token"]').content
const parseJSON = resp => resp.json()

export default {
    submitAnswer: (audioRecording) => {
        return fetch(BASE_URL + '/answer', {
            method: 'POST',
            headers: {
              'X-CSRF-Token': CSRFToken(),
            },
            body: audioRecording,
        })
        .then( parseJSON )
    },

}