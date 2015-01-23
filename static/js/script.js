function loadData() {

    var $wikiElem = $('#wikipedia-links');
    var $searchInput = $('#searchInput').val();

    // clear old data
    $wikiElem.text("");
    $("img").attr("src", "");

    // URLs
    var wikiURL = "http://en.wikipedia.org";
    var wikiBaseURL = wikiURL + "/w/api.php?" + $.param({format:"json", continue:""});
    var opensearchURL = wikiBaseURL + "&" + $.param({action:"opensearch", search: $searchInput});

    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);

    // Get list of articles for input search term
    $.ajax({
        url: opensearchURL,
        dataType: "jsonp",
        success: function(response) {
            var articleList = response[1];
            for (var i=0; i < articleList.length; i++) {
                var articleStr = articleList[i];
                var url = wikiURL + '/wiki/' + articleStr;
                // add links to articles in list
                $('<a>',{
                    href: url,
                    text: articleStr
                }).appendTo($('<li>').appendTo($wikiElem));
            };
            // Get list of image titles from 1st article (this does not include image URL)
            var imageListURL = wikiBaseURL + "&" + $.param({action:"query", prop: "images", titles: articleList[0]});
            $.ajax({
                url: imageListURL,
                dataType: "jsonp",
                success: function(response2) {
                    values = response2.query.pages[Object.keys(response2.query.pages)[0]];
                    imageList = values.images;
                    $("img").each(function(index){
                        imageTitle = imageList[index + 1].title;
                        imageInfoURL = wikiBaseURL + "&prop=imageinfo&iiprop=url&action=query&titles=" + encodeURIComponent(imageTitle);
                        var $img = $(this);
                        // Request image info (which includes URL) for each of first 3 images
                        $.ajax({
                            url: imageInfoURL,
                            dataType: "jsonp",
                            success: function(response3) {
                                // use imageURL to set img src tags
                                imageURL = response3["query"]["pages"]["-1"]["imageinfo"][0]["url"];
                                $img.attr("src", imageURL);
                            }
                        });
                    });
                }
            });
            clearTimeout(wikiRequestTimeout);
        }
    });
    return false;
};

$('#searchForm').submit(loadData);
