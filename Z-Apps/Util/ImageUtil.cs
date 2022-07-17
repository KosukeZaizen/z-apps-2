using Microsoft.AspNetCore.Http;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.Formats.Gif;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Processing;
using System.IO;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Z_Apps.Models.SystemBase;

namespace Z_Apps.Util
{
    public class ImageUtil
    {
        private StorageService storageService;
        public ImageUtil(StorageService storageService)
        {
            this.storageService = storageService;
        }

        public async Task<bool> ResizeAndUploadImage(
            IFormFile file, int maxWidth, int maxHeight, string filePath)
        {
            var img = Image.Load(file.OpenReadStream());

            var height = img.Height;
            var width = img.Width;
            var fixedHeight = 0;
            var fixedWidth = 0;

            if (height > maxHeight || width > maxWidth)
            {
                if (height * maxWidth / maxHeight > width)
                {
                    fixedHeight = maxHeight;
                    fixedWidth = maxHeight * width / height;
                }
                else
                {
                    fixedWidth = maxWidth;
                    fixedHeight = maxWidth * height / width;
                }
            }
            else
            {
                fixedHeight = height;
                fixedWidth = width;
            }

            img.Mutate(x => x.Resize(fixedWidth, fixedHeight));

            /**
             * Reference: https://gist.github.com/mike1477/250c5124e72be0a3756aaacddf43ad25
             **/
            using (var output = new MemoryStream()){
                var extension = Path.GetExtension(file.FileName);
                var encoder = GetEncoder(extension);
                img.Save(output, encoder);
                return await storageService.UploadAndOverwriteFromStreamAsync(output, filePath);
            }
        }

        private static IImageEncoder GetEncoder(string extension)
        {
            IImageEncoder encoder = null;

            extension = extension.Replace(".", "");

            var isSupported = Regex.IsMatch(extension, "gif|png|jpe?g", RegexOptions.IgnoreCase);

            if (isSupported)
            {
                switch (extension)
                {
                    case "png":
                        encoder = new PngEncoder();
                        break;
                    case "jpg":
                        encoder = new JpegEncoder();
                        break;
                    case "jpeg":
                        encoder = new JpegEncoder();
                        break;
                    case "gif":
                        encoder = new GifEncoder();
                        break;
                    default:
                        break;
                }
            }

            return encoder;
        }
    }
}