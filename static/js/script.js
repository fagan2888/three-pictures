function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $searchInput = $('#searchInput').val();
    console.log($searchInput);
    $wikiElem.text("");

    var wikiBaseURL = "http://en.wikipedia.org/w/api.php?format=json&continue=";
    var opensearchURL = wikiBaseURL + "&action=opensearch&search=" + $searchInput;
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);

    $.ajax({
        url: opensearchURL,
        dataType: "jsonp",
        success: function(response) {
            var articleList = response[1];
            for (var i=0; i < articleList.length; i++) {
                var articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            };
            var imageListURL = wikiBaseURL + "&action=query&prop=images&titles=" + response[1][0];
            console.log(imageListURL);
            $.ajax({
                url: imageListURL,
                dataType: "jsonp",
                success: function(response2) {
                    var values = Object.keys(response2.query.pages).map(function(key){
                        return response2.query.pages[key];
                    });
                    imageList = values[0].images;
                    console.log(values);
                    console.log(response2);
                    image1URL = wikiBaseURL + "&prop=imageinfo&iiprop=url&action=query&titles=" + encodeURIComponent(imageList[1].title);
                    image2URL = wikiBaseURL + "&prop=imageinfo&iiprop=url&action=query&titles=" + encodeURIComponent(imageList[2].title);
                    image3URL = wikiBaseURL + "&prop=imageinfo&iiprop=url&action=query&titles=" + encodeURIComponent(imageList[3].title);
                    $.ajax({
                        url: image1URL,
                        dataType: "jsonp",
                        success: function(response3) {
                            imageURL = response3["query"]["pages"]["-1"]["imageinfo"][0]["url"];
                            $("#img1").attr("src", imageURL);
                            console.log(imageURL);
                        }
                    });
                    $.ajax({
                        url: image2URL, 
                        dataType: "jsonp",
                        success: function(response3) {
                            imageURL = response3["query"]["pages"]["-1"]["imageinfo"][0]["url"];
                            $("#img2").attr("src", imageURL);
                            console.log(imageURL);
                        }
                    });
                    $.ajax({
                        url: image3URL,
                        dataType: "jsonp",
                        success: function(response3) {
                            imageURL = response3["query"]["pages"]["-1"]["imageinfo"][0]["url"];
                            $("#img3").attr("src", imageURL);
                            console.log(imageURL);
                        }
                    });
                }
            });
            clearTimeout(wikiRequestTimeout);
        }
    });
/*
    $.ajax({
        url: wikiURL,
        dataType: "jsonp",
        success: function(response) {
            console.log(response);
            var articleURL = "http://en.wikipedia.org/w/api.php?format=json&action=query&titles=" + response[1] + "&prop=revisions&rvprop=content";
            console.log(articleURL);
            $.ajax({
                url: articleURL,
                dataType: "jsonp",
                success: function(response2) {
                    console.log(response2);  
                }
            });
            var url = 'http://en.wikipedia.org/wiki/';
            clearTimeout(wikiRequestTimeout);
        }
    });
*/
    return false;
};

$('#searchForm').submit(loadData);

// loadData();
