import GenericButton from 'components/Button/GenericButton'
import { DownloadIcon, PlusIcon, TrashIcon } from 'components/Icons/icons'
import { useEffect, useRef, useState } from 'react'
import { useStoreBlob } from 'repositories/rpc.repository'

interface Prop {
  cids: string[]
  setIsLoading: (bool: boolean) => void
  setCid: (cid: string) => void
  onEncrypt: () => void
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

  const onClickUpload = () => {
    inputFileRef?.current?.click()
    prop.onEncrypt()
  }

  return (
    <div className={`w-full flex flex-col text-white p-2`}>
      {prop.cids?.map((cid, index) => {
        return (
          <ul className="" key={index}>
            <li className="">
              <div className="overflow-hidden text-ellipsis whitespace-nowrap">Upload: {cid}</div>
              <div className="flex justify-end gap-3 p-2">
                <a
                  href={`${import.meta.env.VITE_IPFS_NFT_STORAGE_URL}/${cid}`}
                  download
                  target="_blank"
                  className="h-8 w-8 bg-green-500 hover:bg-green-300 flex justify-center items-center rounded-lg"
                >
                  <DownloadIcon />
                </a>
                <button
                  className="h-8 w-8 bg-red-900 hover:bg-red-700 flex justify-center items-center rounded-lg"
                  onClick={() => console.log('JK')}
                >
                  <TrashIcon />
                </button>
              </div>
            </li>
          </ul>
        )
      })}

      <div className="absolute flex justify-center items-center text-white right-4 bottom-4 h-8 w-8 bg-red-900 hover:bg-red-700 p-6 rounded-full ">
        <button onClick={onClickUpload} className="flex gap-1">
          <PlusIcon />
        </button>
      </div>

      {/* File input hidden */}
      <input
        id="file"
        ref={inputFileRef}
        name="picker"
        type="file"
        accept=".pdf"
        onChange={() => onSelectFile()}
        className="bg-gray-400 p-3 absolute top-[-99999px] left-[-99999px] hidden"
      />
    </div>
  )
}
