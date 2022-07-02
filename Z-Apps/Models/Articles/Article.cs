public class Article
{
    public string url { get; set; }
    public string title { get; set; }
    public string description { get; set; }
    public string articleContent { get; set; }
    public string imgPath { get; set; }
    public bool released { get; set; }
    public bool isAboutFolktale { get; set; }
    public int authorId { get; set; }
}

public class Author
{
    public int authorId { get; set; }
    public string authorName { get; set; }
    public string initialGreeting { get; set; }
    public string selfIntroduction { get; set; }
    public bool isAdmin { get; set; }
    public string imgExtension { get; set; }
}
