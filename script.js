
  $(document).on("change", ".file-container #file", function () {
    let input_encoded, input_decoded, reader;
    let prefix = "https://web.microsoftstream.com";
    let output_element = $(".output-container #output");
    let download_file = $("a#filedownload")
    let filename;

    reader = new FileReader();
    reader.onload = function(){

      input_encoded =  reader.result;
      input_decoded = atob(input_encoded.split(",")[1]);
      urls = extractUrls(input_decoded, prefix);
      cleanUrls(output_element, download_file);
      showUrls(urls, output_element);
      if (urls.length > 0) {
        attachDownload(urls, download_file, filename);
      }
    };

    reader.readAsDataURL($(this).prop('files')[0]);
    filename = $(this).prop('files')[0].name.split(".")[0];

});


function cleanUrls(element, download) {
  $(element).text("");
  $(download).attr({"href": "", "download": "", "active": "false"});
  $(download).children().attr({"active": "false"});
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


function showUrls(urls, element) {
  if (urls.length > 0) {
    if (urls.length > 1) {
      $(element).append(`<span id="found">Sono stati trovati ${urls.length} link nel file:</span>`);
    } else {
      $(element).append(`<span id="found">È stato trovato 1 link nel file:</span>`);
    }
    urls.forEach(function(item) {
      $(element).append(`<li id="link"><a href="${item}">${item}</a></li>`);
    });
  } else {
    $(element).append('<li id="notfound">Non sono stati trovati link nel file!</li>');
  }
}

function attachDownload(urls, element, filename) {
  let prefix = "data:text/plain;charset=UTF-8,";
  let suffix = ".txt"
  let output = "";

  urls.forEach(function(item) {
    output += item + '\n';
  });


  $(element).attr({"href": prefix + output, "download": filename + suffix, "active": "true"});
  $(element).children().attr({"active": "true"});

}
