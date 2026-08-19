import Icon from '../common/Icon'

const isImageFile = (file) => /\.(avif|gif|jpe?g|png|svg|webp)$/i.test(file.fileName || '')

function FileThumbnail({ file }) {
  const imageFile = isImageFile(file)
  return <span className={`file-icon${imageFile ? ' image-file' : ''}`}><Icon name={imageFile ? 'image' : 'file'} size={21} />{imageFile && <img src={`/api/files/${file.id}/download`} alt="" loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none' }} />}</span>
}

export default FileThumbnail
