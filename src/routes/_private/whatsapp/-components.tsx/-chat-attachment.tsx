import { AnyType } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState, useMemo } from "react"
import { getUnipile } from "../-utils"
import { Loader2, File, Download, AlertCircle, AlertCircleIcon, ExternalLink } from "lucide-react"
import LoadingComponent from "@/components/common/loading-component"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ChatAttachment({
  message,
  attachment
}: {
  message: string,
  attachment: AnyType
}) {
  const [objectUrl, setObjectUrl] = useState<string>("")

  const { data, isLoading, error } = useQuery({
    queryKey: ['whatsapp', 'attachment', message, attachment?.id],
    queryFn: async () => {
      const response = await getUnipile({
        data: {
          url: `/messages/${message}/attachments/${attachment?.id}`,
          attachment: true
        }
      })
      if (response && response.data && Array.isArray(response.data) && response.type) {
        const uint8Array = new Uint8Array(response.data)
        const blob = new Blob([uint8Array], { type: response.type })
        return blob
      }
      if (response instanceof Blob) {
        return response
      }
      throw new Error('Invalid response format')
    },
    gcTime: Infinity,
    staleTime: Infinity,
    enabled: !attachment?.unavailable && !!message && !!attachment?.id,
  })

  const attachmentType = useMemo(() => {
    if (data?.type) {
      if (data.type.startsWith('image/')) return 'image'
      if (data.type.startsWith('video/')) return 'video'
      if (data.type.startsWith('audio/')) return 'audio'
      if (data.type.startsWith('application/pdf')) return 'pdf'
      if (data.type.startsWith('text/')) return 'text'
    }
    const fileName = attachment?.file_name?.toLowerCase() || ''
    if (fileName.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return 'image'
    if (fileName.match(/\.(mp4|avi|mov|wmv|flv|webm|mkv)$/)) return 'video'
    if (fileName.match(/\.(mp3|wav|ogg|m4a|aac|flac)$/)) return 'audio'
    if (fileName.match(/\.pdf$/)) return 'pdf'
    if (fileName.match(/\.(txt|md|json|xml|csv)$/)) return 'text'
    
    return 'file'
  }, [data?.type, attachment?.file_name])

  useEffect(() => {
    if (data && data instanceof Blob) {
      const url = URL.createObjectURL(data)
      setObjectUrl(url)
      
      return () => {
        URL.revokeObjectURL(url)
      }
    }
  }, [data])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDownload = () => {
    if (objectUrl) {
      const link = document.createElement('a')
      link.href = objectUrl
      link.download = attachment.file_name || 'attachment'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleViewInNewTab = () => {
    if (objectUrl) {
      window.open(objectUrl, '_blank', 'noopener,noreferrer')
    }
  }

  if (isLoading) {
    return (
      <div className="relative rounded-xl w-full h-[100px] border">
        <LoadingComponent isLoading={isLoading} />
      </div>
    )
  }

  if (error || attachment?.unavailable) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>{attachment?.unavailable ? 'Attachment unavailable' : 'Failed to load attachment'}</AlertTitle>
        {error && (
          <AlertDescription>
            <p className="text-xs">{error.message || 'Something went wrong. Please try again.'}</p>
          </AlertDescription>
        )}
      </Alert>
    )
  }

  const renderAttachment = () => {
    if (!objectUrl || !data) return null

    const fileName = attachment?.file_name || 'Unknown file'
    const fileSize = data.size ? formatFileSize(data.size) : null

    switch (attachmentType) {
      case 'image':
        return (
          <div className="relative group">
            <img 
              src={objectUrl} 
              alt={fileName} 
              className="h-50 w-auto max-w-full rounded-xl border cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
              onClick={handleViewInNewTab}
              loading="lazy"
            />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button
                onClick={handleViewInNewTab}
                className="p-1.5 bg-black/70 text-white rounded-md hover:bg-black/80 transition-colors"
                title="View full size"
              >
                <ExternalLink className="size-3" />
              </button>
              <button
                onClick={handleDownload}
                className="p-1.5 bg-black/70 text-white rounded-md hover:bg-black/80 transition-colors"
                title="Download"
              >
                <Download className="h-3 w-3" />
              </button>
            </div>
            {fileSize && (
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {fileSize}
              </div>
            )}
          </div>
        )

      case 'video':
        return (
          <video 
            src={objectUrl} 
            controls
            className="size-auto max-w-full max-h-100 rounded-xl border shadow-sm cursor-pointer"
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        )

      case 'audio':
        return (
          <div>
            <audio 
              src={objectUrl}
              controls 
              className="w-xs"
              preload="metadata"
            >
              Your browser does not support the audio tag.
            </audio>
          </div>
        )

      case 'pdf':
        return (
          <div className="border rounded-xl overflow-hidden shadow-sm max-w-full bg-accent">
            <div className="bg-accent">
              <iframe 
                src={objectUrl} 
                width="100%" 
                height="400"
                title={fileName}
                className="border-0"
              />
            </div>
            <div className="flex flex-col p-3 border-b">
              <p className="text-sm font-medium text-muted-foreground">{fileName}</p>
              {fileSize && <p className="text-xs text-muted-foreground">{fileSize}</p>}
            </div>
            
          </div>
        )

      default:
        return (
          <div className="flex items-center gap-3 p-3 bg-muted/30 border rounded-lg hover:bg-muted/50 transition-colors max-w-md">
            <div className="p-2 bg-muted rounded-md">
              <File className="size-4 text-muted-foreground" />
            </div>
            <div className="flex-1 flex flex-col min-w-0">
              <p className="text-sm font-medium">{fileName}</p>
              {fileSize && <span className="text-xs text-muted">{fileSize}</span>}
            </div>
            <button
              onClick={handleDownload}
              className="p-2 text-black hover:text-muted-foreground rounded-md hover:bg-muted transition-colors"
              title="Download"
            >
              <Download className="size-4" />
            </button>
          </div>
        )
    }
  }

  return (
    <div className="max-w-full">
      {renderAttachment()}
    </div>
  )
}
