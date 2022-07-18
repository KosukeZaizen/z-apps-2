using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.Formats.Gif;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Processing;
using System.Text.RegularExpressions;

namespace Z_Apps.Util
{
    public class ImageUtil
    {
        public static void ResizeImage(Image img, int maxWidth, int maxHeight)
        {
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
        }

        public static IImageEncoder GetEncoder(string extension)
        {
            IImageEncoder encoder = null;

            extension = extension.Replace(".", "").ToLower();

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