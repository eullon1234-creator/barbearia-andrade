// Serviço de Upload direto para o Cloudinary (Unsigned)
export const CLOUDINARY_CONFIG = {
  cloudName: 'dbgxrowf',
  uploadPreset: 'barbearia andrade',
};

/**
 * Converte qualquer arquivo ou Blob para DataURL (Base64) garantindo compatibilidade móvel
 */
async function toDataUrl(file) {
  if (typeof file === 'string') return file;
  if (typeof FileReader !== 'undefined') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(new Error('Erro ao ler arquivo da imagem: ' + err));
      reader.readAsDataURL(file);
    });
  }
  return file;
}

/**
 * Faz o upload de um arquivo de imagem diretamente para o Cloudinary
 * @param {File|Blob|string} file - Arquivo de imagem vindo do input file, câmera ou recorte
 * @returns {Promise<string>} - URL segura da imagem gerada pelo Cloudinary
 */
export async function uploadImageToCloudinary(file) {
  if (!file) {
    throw new Error('Nenhum arquivo fornecido para upload.');
  }

  const fileData = await toDataUrl(file);

  const formData = new FormData();
  formData.append('file', fileData);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Falha ao enviar imagem para o Cloudinary.');
  }

  const data = await response.json();
  return data.secure_url;
}
