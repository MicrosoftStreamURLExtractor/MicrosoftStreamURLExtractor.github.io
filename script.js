
  $(document).on("change", ".file-container #file", function () {
    let input_encoded, input_decoded, reader;
    let prefix = "https://web.microsoftstream.com";
    let output_element = $(".output-container #output");
    let download_button = $(".output-container #download");
    let download_file = $(".output-container #filedownload")

    reader = new FileReader();
    reader.onload = function(){
      input_encoded =  reader.result;
      input_decoded = atob(input_encoded.split(",")[1]);
      urls = extractUrls(input_decoded, prefix);
      cleanUrls(output_element, download_button);
      showUrls(urls, output_element, download_button);
      if (urls.length > 0) {
        attachDownload(urls, download_file);
      }
    };

    reader.readAsDataURL($(this).prop('files')[0]);
});


function cleanUrls(element, button) {
  $(element).text("");
  $(button).css("display", "none");
}


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


function showUrls(urls, element, button) {
  if (urls.length > 0) {
    urls.forEach(function(item) {
      $(element).append(`<li id="link"><a href="${item}">${item}</a></li>`);
    });
    $(button).css("display", "block");
  } else {
    $(element).append(`<li id="notfound">No links found in file</li>`);
  }
}

function attachDownload(urls, element) {
  let prefix = "data:text/plain;charset=UTF-8,";
  let output = "";
  let filename = "microsoft_streams_list.txt";

  urls.forEach(function(item) {
    output += item + '\n';
  });


  $(element).attr("href", prefix + output);
  $(element).attr("download", filename);

}
