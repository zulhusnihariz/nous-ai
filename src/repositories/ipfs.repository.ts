import { useMutation, useQuery } from '@tanstack/react-query'
import { useIpfs } from 'hooks/use-ipfs'
import { NFTStorage } from 'nft.storage'
import { RQ_KEY } from 'repositories'

const useStoreBlob = () => {
  const { ipfs } = useIpfs()

  return useMutation({
    mutationFn: async (blob: Blob) => {
      const resp = await ipfs?.storeBlob(blob)
      const url = `${import.meta.env.VITE_IPFS_NFT_STORAGE_URL}/${resp}`
      return url
    },
  })
}

const useStoreDirectory = () => {
  const { ipfs } = useIpfs()

  return useMutation({
    mutationFn: async (files: File[]) => {
      const resp = await (ipfs as NFTStorage)?.storeDirectory(files)
      const url = `${import.meta.env.VITE_IPFS_NFT_STORAGE_URL}/${resp}`
      return url
    },
  })
}

function convertChunksToFile(chunks: Uint8Array[], fileName: string) {
  const blob = new Blob(chunks)
  const file = new File([blob], fileName)
  return file
}

export type IPFSFile = {
  cid: string
  name: string
  path: string
  size: number
  type: string
  content: File
}

const useGetDirectory = (cids: string[]) => {
  const { ipfsFork } = useIpfs()
  const cid = cids[0]

  return useQuery<IPFSFile[]>({
    queryKey: [RQ_KEY.GET_DIRECTORY, cid],
    queryFn: async () => {
      const files: IPFSFile[] = []

      try {
        for await (const file of ipfsFork.ls(cid)) {
          const chunks = []
          for await (const chunk of ipfsFork.cat(file.path)) {
            chunks.push(chunk)
          }

          files.push({ ...file, cid: file.cid.toString(), content: convertChunksToFile(chunks, file.name) })
        }

        return files
      } catch (e) {
        return []
      }
    },
    initialData: [],
    enabled: cids.length > 0,
  })
}

export { useStoreBlob, useStoreDirectory, useGetDirectory }
