import cloudinary from './cloudinary';

export const uploadImage = async (file: File, folder: string) => {
	const buffer = await file.arrayBuffer();
	const base64 = Buffer.from(buffer).toString('base64');
	const dataUrl = `data:${file.type};base64,${base64}`;

	const result = await cloudinary.uploader.upload(dataUrl, {
		folder,
		resource_type: 'image'
	});

	return {
		secure_url: result.secure_url,
		public_id: result.public_id
	};
};

export const deleteImage = async (publicId: string) => {
	console.log(publicId);
	const result = await cloudinary.uploader.destroy(publicId, {
		resource_type: 'image'
	});
	return result;
};
