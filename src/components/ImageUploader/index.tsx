import GenericButton from 'components/Button/GenericButton'
import { CameraIcon } from 'components/Icons/icons'
import { useEffect, useRef, useState } from 'react'
import { useStoreBlob } from 'repositories/ipfs.repository'

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
    const filePicker = document.getElementById('image') as HTMLInputElement

    if (!filePicker || !filePicker.files || filePicker.files.length <= 0) {
      return
    }

    const pickedFile = filePicker.files[0]

    setFile(pickedFile)
    setImagePreview(URL.createObjectURL(pickedFile))
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
    <div className={`w-full text-left`}>
      {imagePreview && <img className="h-full w-full object-contain" src={imagePreview} />}
      <div className="">
        <GenericButton
          onClick={() => {
            inputFileRef?.current?.click()
          }}
          name="Image"
          icon={<CameraIcon />}
          className=""
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
