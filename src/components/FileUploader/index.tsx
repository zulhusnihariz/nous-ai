import { DownloadIcon, PlusIcon, TrashIcon } from 'components/Icons/icons'
import { useEffect, useRef, useState } from 'react'
import { IPFSFile, useStoreDirectory } from 'repositories/ipfs.repository'

interface Prop {
  cids: string[]
  existingFiles: IPFSFile[]
  setIsLoading: (bool: boolean) => void
  onDeleteFile: (cid: string) => Promise<void>
  onUploadFile: (cid: string) => Promise<void>
}

export const FileUploader = (prop: Prop) => {
  const [file, setFile] = useState<File>()
  const inputFileRef = useRef<HTMLInputElement>(null)
  const { mutateAsync: storeDirectory } = useStoreDirectory()

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
      const results = await storeDirectory([...prop.existingFiles?.map(el => el.content), file as File])
      const split = results.split('/')
      const cid = split[split.length - 1]
      prop.onUploadFile(cid)
      prop.setIsLoading(false)
    }

    if (file) {
      upload()
    }
  }, [file])

  const onClickUpload = () => {
    inputFileRef?.current?.click()
  }

  return (
    <div className={`w-full flex flex-col text-white p-2`}>
      {prop.existingFiles?.map((file, index) => {
        return (
          <ul className="" key={index}>
            <li className="">
              <div className="overflow-hidden text-ellipsis whitespace-nowrap">Upload: {file.path}</div>
              <div className="flex justify-end gap-3 p-2">
                <a
                  href={`${import.meta.env.VITE_IPFS_NFT_STORAGE_URL}/${file.cid}`}
                  download
                  target="_blank"
                  className="h-8 w-8 bg-green-500 hover:bg-green-300 flex justify-center items-center rounded-lg"
                >
                  <DownloadIcon />
                </a>
                <button
                  className="h-8 w-8 bg-red-900 hover:bg-red-700 flex justify-center items-center rounded-lg"
                  onClick={async () => prop.onDeleteFile(file.cid)}
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
