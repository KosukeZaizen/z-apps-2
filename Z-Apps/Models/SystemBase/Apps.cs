using System.Collections.Generic;

namespace Z_Apps.Models.SystemBase
{
    public class AppInfo
    {
        public string Key { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
    }

    public class AppKey
    {
        public static readonly string www = "www";
        public static readonly string articles = "articles-edit";
        public static readonly string vocab = "vocab";
    }

    public class Apps
    {
        // アプリ追加時は、hostsに新しいドメインを追加する
        public static readonly List<AppInfo> apps = new List<AppInfo>()
        {
            new AppInfo(){
                Key = AppKey.www,
                Title = "Lingual Ninja - Learn Japanese Online",
                Description = "Free app to learn Japanese! You can study Japanese from Japanese folktales!",
            },
            new AppInfo(){
                Key = AppKey.articles,
                Title = "Lingual Ninja Blog",
                Description = "Articles about studying Japanese language and culture! I hope these articles help you to learn about Japan!",
            },
            new AppInfo(){
                Key = AppKey.vocab,
                Title = "Learn Japanese Vocab from Videos",
                Description = "Let's use videos to learn Japanese vocabulary! You can learn a lot of Japanese words from this website!",
            },
        };
    }
}