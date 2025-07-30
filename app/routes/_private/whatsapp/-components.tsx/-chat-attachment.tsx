import { AnyType } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState, useMemo } from "react"
import { getUnipile } from "../-utils"
import { Loader2, File, Download, AlertCircle } from "lucide-react"

export default function ChatAttachment({
  id,
  attachment
}: {
  id: string,
  attachment: AnyType
}) {
  const [objectUrl, setObjectUrl] = useState<string>("")

  const { data, isLoading, error: queryError } = useQuery({
    queryKey: ['whatsapp', 'attachment', id, attachment?.id],
    queryFn: async () => {
      const response = await getUnipile({
        data: {
          url: `/messages/${id}/attachments/${attachment?.id}`,
          attachment: true
        }
      })
      
      // Handle serialized blob data from server function
      if (response && response.data && Array.isArray(response.data) && response.type) {
        const uint8Array = new Uint8Array(response.data)
        const blob = new Blob([uint8Array], { type: response.type })
        return blob
      }
      
      // Fallback for direct blob (shouldn't happen with TanStack Start)
      if (response instanceof Blob) {
        return response
      }
      
      console.error('Invalid response format:', response)
      throw new Error('Invalid response format')
    },
    gcTime: Infinity,
    staleTime: Infinity,
    enabled: !attachment?.unavailable && !!id && !!attachment?.id,
    retry: 2,
    retryDelay: 1000
  })

  // Determine attachment type from MIME type or file extension
  const attachmentType = useMemo(() => {
    // First try to get type from blob
    if (data?.type) {
      if (data.type.startsWith('image/')) return 'image'
      if (data.type.startsWith('video/')) return 'video'
      if (data.type.startsWith('audio/')) return 'audio'
      if (data.type.startsWith('application/pdf')) return 'pdf'
      if (data.type.startsWith('text/')) return 'text'
    }
    
    // Fallback to file extension
    const fileName = attachment?.file_name?.toLowerCase() || ''
    if (fileName.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return 'image'
    if (fileName.match(/\.(mp4|avi|mov|wmv|flv|webm|mkv)$/)) return 'video'
    if (fileName.match(/\.(mp3|wav|ogg|m4a|aac|flac)$/)) return 'audio'
    if (fileName.match(/\.pdf$/)) return 'pdf'
    if (fileName.match(/\.(txt|md|json|xml|csv)$/)) return 'text'
    
    return 'file'
  }, [data?.type, attachment?.file_name])

  // Create and cleanup object URL
  useEffect(() => {
    if (data && data instanceof Blob) {
      const url = URL.createObjectURL(data)
      setObjectUrl(url)
      
      // Cleanup function
      return () => {
        URL.revokeObjectURL(url)
      }
    }
  }, [data])

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Handle download
  const handleDownload = () => {
    if (objectUrl && attachment?.file_name) {
      const link = document.createElement('a')
      link.href = objectUrl
      link.download = attachment.file_name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  // Handle view in new tab
  const handleViewInNewTab = () => {
    if (objectUrl) {
      window.open(objectUrl, '_blank', 'noopener,noreferrer')
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center bg-muted/50 rounded-lg w-full h-[100px] border border-border">
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Loading attachment...</span>
        </div>
      </div>
    )
  }

  // Show error state
  if (queryError || attachment?.unavailable) {
    return (
      <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
        <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm text-destructive font-medium">
            {attachment?.unavailable ? 'Attachment unavailable' : 'Failed to load attachment'}
          </p>
          {queryError && (
            <p className="text-xs text-destructive/80 mt-1">
              {queryError.message || 'Something went wrong. Please try again.'}
            </p>
          )}
        </div>
      </div>
    )
  }

  // Show attachment based on type
  const renderAttachment = () => {
    if (!objectUrl || !data) return null

    const fileName = attachment?.file_name || 'Unknown file'
    const fileSize = data.size ? formatFileSize(data.size) : null

    switch (attachmentType) {
      case 'image':
        return (
          <div className="relative group max-w-sm">
            <img 
              src={objectUrl} 
              alt={fileName} 
              className="max-w-full h-auto rounded-lg border border-border cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
              onClick={handleViewInNewTab}
              loading="lazy"
            />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button
                onClick={handleViewInNewTab}
                className="p-1.5 bg-black/70 text-white rounded-md hover:bg-black/80 transition-colors"
                title="View full size"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
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
          <div className="relative max-w-md">
            <video 
              src={objectUrl} 
              controls 
              className="max-w-full h-auto rounded-lg border border-border shadow-sm"
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
            <button
              onClick={handleDownload}
              className="absolute top-2 right-2 p-1.5 bg-black/70 text-white rounded-md hover:bg-black/80 transition-colors"
              title="Download"
            >
              <Download className="h-3 w-3" />
            </button>
            <div className="mt-2 text-xs text-muted-foreground text-center">
              {fileName} {fileSize && `• ${fileSize}`}
            </div>
          </div>
        )

      case 'audio':
        return (
          <div className="w-full max-w-md p-3 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-primary/10 rounded-full">
                <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{fileName}</p>
                {fileSize && <p className="text-xs text-muted-foreground">{fileSize}</p>}
              </div>
              <button
                onClick={handleDownload}
                className="p-1.5 hover:bg-muted rounded-md transition-colors"
                title="Download"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
            <audio 
              src={objectUrl} 
              controls 
              className="w-full"
              preload="metadata"
            >
              Your browser does not support the audio tag.
            </audio>
          </div>
        )

      case 'pdf':
        return (
          <div className="border border-border rounded-lg overflow-hidden bg-background shadow-sm max-w-2xl">
            <div className="flex items-center justify-between p-3 bg-muted/30 border-b border-border">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="p-1.5 bg-red-100 rounded">
                  <svg className="h-4 w-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M20,16H8V4H20V16Z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{fileName}</p>
                  {fileSize && <p className="text-xs text-muted-foreground">{fileSize}</p>}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleViewInNewTab}
                  className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Open
                </button>
                <button
                  onClick={handleDownload}
                  className="p-1.5 hover:bg-muted rounded-md transition-colors"
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="bg-gray-50">
              <iframe 
                src={objectUrl} 
                width="100%" 
                height="400" 
                title={fileName}
                className="border-0"
              />
            </div>
          </div>
        )

      default:
        return (
          <div className="flex items-center gap-3 p-3 bg-muted/30 border border-border rounded-lg hover:bg-muted/50 transition-colors max-w-md">
            <div className="p-2 bg-muted rounded-full flex-shrink-0">
              <File className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{fileName}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                {data.type && <span className="truncate">{data.type}</span>}
                {fileSize && <span>• {fileSize}</span>}
              </div>
            </div>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-muted rounded-md transition-colors flex-shrink-0"
              title="Download"
            >
              <Download className="h-4 w-4" />
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