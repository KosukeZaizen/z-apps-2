using System.Text.Json.Serialization;
using Z_Apps.Util;

namespace Z_Apps.Models
{
    public class User
    {
        public int UserId
        {
            get; set;
        }

        public string Name
        {
            get; set;
        }

        public string Email
        {
            get; set;
        }

        [JsonIgnore]
        public string Password
        {
            get; set;
        }
        public string Progress
        {
            get; set;
        }

        public long Xp
        {
            get; set;
        }

        public int Level
        {
            get
            {
                return UserService.GetLevelFromXp(Xp);
            }
        }

        [JsonIgnore]
        public string AvatarExtension { get; set; }
        private static int imagePathVersion = 0; // For refreshing the browser cache
        public string AvatarPath
        {
            get
            {
                if (string.IsNullOrEmpty(AvatarExtension))
                {
                    return "";
                }
                imagePathVersion++;
                if (imagePathVersion > 10000)
                {
                    imagePathVersion = 0;
                }
                return $"{Consts.BLOB_URL}/user/{UserId}/avatarImage/150_150{AvatarExtension}?v={imagePathVersion}";
            }
        }

        private string _Bio;
        public string Bio
        {
            get
            {
                if (string.IsNullOrEmpty(_Bio))
                {
                    return @$"Hello! I'm **{Name}**! Nice to meet you!

I hope we can be friends!";
                }
                return _Bio;
            }
            set
            {
                _Bio = value;
            }
        }
    }
}