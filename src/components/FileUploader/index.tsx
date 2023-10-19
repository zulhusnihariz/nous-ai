import GenericButton from 'components/Button/GenericButton'
import { PlusIcon } from 'components/Icons/icons'
import { useEffect, useRef, useState } from 'react'
import { useStoreBlob } from 'repositories/rpc.repository'

interface Prop {
  cids: string[]
  setIsLoading: (bool: boolean) => void
  setCid: (cid: string) => void
}

export const FileUploader = (prop: Prop) => {
  const [file, setFile] = useState<File>()
  const inputFileRef = useRef<HTMLInputElement>(null)
  const { mutateAsync: storeBlob } = useStoreBlob()

  const onSelectFile = () => {
    const filePicker = document.getElementById('file') as HTMLInputElement

    if (!filePicker || !filePicker.files || filePicker.files.length <= 0) {
      return
    }

    const pickedFile = filePicker.files[0]
    setFile(pickedFile)
  }

  useEffect(() => {
    async function upload() {
      prop.setIsLoading(true)
      const results = await storeBlob(new Blob([file as File]))
      const split = results.split('/')
      const cid = split[split.length - 1]
      prop.setCid(cid)
      prop.setIsLoading(false)
    }

    if (file) {
      upload()
    }
  }, [file])

  return (
    <div className={`w-full text-center`}>
      {prop.cids?.map((cid, index) => {
        return (
          <ul className="mb-2" key={index}>
            <li className="flex">
              <p className="text-ellipsis overflow-hidden">{cid}</p>
              <a href={`${import.meta.env.VITE_IPFS_NFT_STORAGE_URL}/${cid}`} download target="_blank">
                Download
              </a>
            </li>
          </ul>
        )
      })}

      <div className="flex justify-center gap-4">
        <GenericButton
          onClick={() => {
            inputFileRef?.current?.click()
          }}
          name=""
          icon={<PlusIcon />}
          className=""
        />
      </div>

      <div className="flex gap-5 justify-left p-3">
        <input
          id="file"
          ref={inputFileRef}
          name="picker"
          type="file"
          accept=".pdf"
          onChange={() => onSelectFile()}
          className="bg-gray-400 p-3 hidden"
        />
      </div>
    </div>
  )
}
