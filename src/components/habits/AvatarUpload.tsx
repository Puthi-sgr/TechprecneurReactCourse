import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

const MAX_AVATAR_BYTES = 1024 * 1024

interface AvatarUploadProps {
  userId: string
  initialAvatarUrl: string | null
  onSaved: (url: string) => void
}

export function AvatarUpload({ userId, initialAvatarUrl, onSaved }: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => setAvatarUrl(initialAvatarUrl), [initialAvatarUrl])

  useEffect(() => {
    return () => {
      if (previewUrl !== null) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0]
    setError(null)
    setSelectedFile(null)
    setPreviewUrl(null)
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Choose an image file, such as a PNG, JPG, or WebP.')
      event.currentTarget.value = ''
      return
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setError('That image is too large. Choose a file no bigger than 1 MB.')
      event.currentTarget.value = ''
      return
    }

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const uploadAvatar = async () => {
    if (selectedFile === null) return
    setUploading(true)
    setError(null)
    try {
      const extension = selectedFile.name.split('.').pop()?.toLowerCase() || 'png'
      const objectPath = `${userId}/avatar.${extension}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(objectPath, selectedFile, { upsert: true, contentType: selectedFile.type })
      if (uploadError !== null) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(objectPath)
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ id: userId, avatar_url: data.publicUrl }, { onConflict: 'id' })
      if (profileError !== null) throw profileError

      setAvatarUrl(data.publicUrl)
      setSelectedFile(null)
      setPreviewUrl(null)
      onSaved(data.publicUrl)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not upload your avatar. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm" aria-labelledby="avatar-heading">
      <div className="flex flex-wrap items-center gap-4">
        <img
          src={previewUrl ?? avatarUrl ?? '/avatar-placeholder.svg'}
          alt={previewUrl !== null ? 'Preview of the selected avatar' : 'Your profile avatar'}
          className="size-16 rounded-full border border-gray-200 object-cover"
        />
        <div className="min-w-0 flex-1">
          <h2 id="avatar-heading" className="font-semibold text-gray-900">Your avatar</h2>
          <p className="mt-1 text-sm text-gray-500">Images up to 1 MB. Your preview appears before upload.</p>
        </div>
        <label className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
          Choose image
          <input type="file" accept="image/*" onChange={handleFileChange} className="sr-only" aria-label="Choose avatar image" />
        </label>
        {selectedFile !== null && (
          <Button type="button" onClick={() => void uploadAvatar()} disabled={uploading}>
            {uploading ? 'Uploading…' : 'Upload avatar'}
          </Button>
        )}
      </div>
      {error !== null && <p className="mt-3 text-sm font-medium text-red-700" role="alert">{error}</p>}
      {previewUrl !== null && <p className="mt-3 text-sm text-emerald-700">Preview ready: {selectedFile?.name}</p>}
    </section>
  )
}
