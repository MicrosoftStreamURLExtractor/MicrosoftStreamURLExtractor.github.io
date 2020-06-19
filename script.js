
  $(document).on("change", ".file-container #file", function () {
    let input_encoded, input_decoded, reader;
    let prefix = "https://web.microsoftstream.com"
    let output_element = $(".output-container #output")
    reader = new FileReader();
    reader.onload = function(){
      input_encoded =  reader.result;
      input_decoded = atob(input_encoded.split(",")[1]);
      urls = extractUrls(input_decoded, prefix);
      showUrls(urls, output_element);
    };

    reader.readAsDataURL($(this).prop('files')[0]);
});


function extractUrls(text, prefix){
    let re = /\/video\/.{36}/g;
    let urls = text.match(re);

    if(urls === null){
        return [];
    }

    let urls_set = new Set(urls);
    let unique_urls = [];
    urls_set.forEach(function(item) {
      unique_urls.push(prefix + item);
    });

    return unique_urls;
}

function showUrls(urls, element) {

  urls.forEach(function(item) {
    $(element).append(`<li><a href="#">${item}</a></li>`)
  });

}
