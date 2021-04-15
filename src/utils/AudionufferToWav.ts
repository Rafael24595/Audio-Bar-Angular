export class AudiobufferToWav{

    //////////////////////////////////////////////////////////////////////////////
    // All credits to Matt DesLauriers form GitHub: https://github.com/mattdesl //
    //////////////////////////////////////////////////////////////////////////////

    public static audioBufferToWav (buffer: AudioBuffer, opt?: { float32?: any } | undefined) {
        opt = opt || {}
      
        var numChannels = buffer.numberOfChannels
        var sampleRate = buffer.sampleRate
        var format = opt.float32 ? 3 : 1
        var bitDepth = format === 3 ? 32 : 16
      
        var result
        if (numChannels === 2) {
          result = AudiobufferToWav.interleave(buffer.getChannelData(0), buffer.getChannelData(1))
        } else {
          result = buffer.getChannelData(0)
        }
      
        return AudiobufferToWav.encodeWAV(result, format, sampleRate, numChannels, bitDepth)
      }
      
      public static encodeWAV (samples: string | any[] | Float32Array, format: number, sampleRate: number, numChannels: number, bitDepth: number) {
        var bytesPerSample = bitDepth / 8
        var blockAlign = numChannels * bytesPerSample
      
        var buffer = new ArrayBuffer(44 + samples.length * bytesPerSample)
        var view = new DataView(buffer)
      
        /* RIFF identifier */
        AudiobufferToWav.writeString(view, 0, 'RIFF')
        /* RIFF chunk length */
        view.setUint32(4, 36 + samples.length * bytesPerSample, true)
        /* RIFF type */
        AudiobufferToWav.writeString(view, 8, 'WAVE')
        /* format chunk identifier */
        AudiobufferToWav.writeString(view, 12, 'fmt ')
        /* format chunk length */
        view.setUint32(16, 16, true)
        /* sample format (raw) */
        view.setUint16(20, format, true)
        /* channel count */
        view.setUint16(22, numChannels, true)
        /* sample rate */
        view.setUint32(24, sampleRate, true)
        /* byte rate (sample rate * block align) */
        view.setUint32(28, sampleRate * blockAlign, true)
        /* block align (channel count * bytes per sample) */
        view.setUint16(32, blockAlign, true)
        /* bits per sample */
        view.setUint16(34, bitDepth, true)
        /* data chunk identifier */
        AudiobufferToWav.writeString(view, 36, 'data')
        /* data chunk length */
        view.setUint32(40, samples.length * bytesPerSample, true)
        if (format === 1) { // Raw PCM
            AudiobufferToWav.floatTo16BitPCM(view, 44, samples)
        } else {
            AudiobufferToWav.writeFloat32(view, 44, samples)
        }
      
        return buffer
      }
      
      public static interleave (inputL: string | any[] | Float32Array, inputR: string | any[] | Float32Array) {
        var length = inputL.length + inputR.length
        var result = new Float32Array(length)
      
        var index = 0
        var inputIndex = 0
      
        while (index < length) {
          result[index++] = inputL[inputIndex]
          result[index++] = inputR[inputIndex]
          inputIndex++
        }
        return result
      }
      
      public static writeFloat32 (output: DataView, offset: number, input: string | any[] | Float32Array) {
        for (var i = 0; i < input.length; i++, offset += 4) {
          output.setFloat32(offset, input[i], true)
        }
      }
      
      public static floatTo16BitPCM (output: DataView, offset: number, input: string | any[] | Float32Array) {
        for (var i = 0; i < input.length; i++, offset += 2) {
          var s = Math.max(-1, Math.min(1, input[i]))
          output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true)
        }
      }
      
      public static writeString (view: DataView, offset: number, string: string) {
        for (var i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i))
        }
      }

}