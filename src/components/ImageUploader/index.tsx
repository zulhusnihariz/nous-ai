import GenericButton from 'components/Button/GenericButton'
import { CameraIcon } from 'components/Icons/icons'
import { useEffect, useRef, useState } from 'react'
import imageCompression from 'browser-image-compression'
import { useStoreBlob } from 'repositories/rpc.repository'

interface Prop {
  url: string
  setImageURL: (url: string) => void
  setIsLoading: (bool: boolean) => void
}

export const ImageUploader = (prop: Prop) => {
  const [file, setFile] = useState<File | Blob>()
  const [imagePreview, setImagePreview] = useState('')
  const inputFileRef = useRef<HTMLInputElement>(null)
  const { mutateAsync: storeBlob, data: url } = useStoreBlob()

  const onSelectMedia = () => {
    return new Promise<void>((resolve, reject) => {
      const filePicker = document.getElementById('image') as HTMLInputElement

      if (!filePicker || !filePicker.files || filePicker.files.length <= 0) {
        reject('No file selected')
        return
      }

      const pickedFile = filePicker.files[0]

      const options = {
        maxSizeMB: 300,
        maxWidthOrHeight: 400,
      }

      imageCompression(pickedFile, options)
        .then(compressedFile => {
          setFile(compressedFile)
          setImagePreview(URL.createObjectURL(compressedFile))
        })
        .catch(e => {
          console.log(e)
        })

      resolve()
    })
  }

  useEffect(() => {
    async function upload() {
      prop.setIsLoading(true)
      await storeBlob(new Blob([file as File]))
      prop.setIsLoading(false)
    }

    if (file) {
      upload()
    }
  }, [file, storeBlob])

  useEffect(() => {
    function setURL() {
      if (url) prop.setImageURL(url)
    }

    if (url) setURL()
  }, [url])

  useEffect(() => {
    if (!imagePreview) setImagePreview(prop.url)
  }, [imagePreview])

  return (
    <div className={`relative  w-full ${imagePreview ? 'h-[150px]' : 'h-[100px]'}`}>
      {!imagePreview && (
        <div className="h-full w-full flex justify-center items-center bg-gray-100">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#e0e0e0"
              className="w-12 h-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </span>
        </div>
      )}
      {imagePreview && <img className="h-full w-full object-contain" src={imagePreview} />}
      <div className="absolute h-0">
        <GenericButton
          onClick={() => {
            inputFileRef?.current?.click()
          }}
          name="Image"
          icon={<CameraIcon />}
          className="absolute bottom-14 left-1"
        />
      </div>

      <div className="flex gap-5 justify-left p-3">
        <input
          id="image"
          ref={inputFileRef}
          name="image"
          type="file"
          accept="image/x-png, image/jpeg, image/gif"
          onChange={() => onSelectMedia()}
          className="bg-gray-400 p-3 hidden"
        />
      </div>
    </div>
  )
}
