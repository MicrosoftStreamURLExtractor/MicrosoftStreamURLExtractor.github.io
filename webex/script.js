$(document).on("change", ".file-container #file", function() {
    let input_encoded, input_decoded, reader;
    let prefix = "https://politecnicomilano.webex.com/recordingservice/sites/politecnicomilano/recording";
    let output_element = $(".output-container .linklist"); // list of links
    let summary_element = $(".output-container .summary"); // how many links have been found
    let download_file = $(".file-container a#filedownload") // download link
    let bar = $(".progressbar") // loading bar
    let filename;

    reader = new FileReader();
    reader.onload = function() {
      // clean urls containers in page
      cleanUrls(output_element, download_file, summary_element);

      $(bar).css({"display": "block"});
      $(bar).children(":first").css({"width": "0"});
      $(bar).children(":first").animate({"width": "100%", "display": "inline"}, 700, function() {
        $(bar).css({"display": "none"});
        // extract the base64 encoded content of the file
        input_encoded = reader.result;
        // decode from base64 and skip the first part, comma separated, containing infos about the file
        input_decoded = atob(input_encoded.split(",")[1]);
        // extract urls
        urls = extractUrls(input_decoded, prefix);
        // show urls on container
        showUrls(urls, output_element, summary_element);
        if (urls.length > 0) {
          // if we found any urls, format all the links
            attachDownload(urls, download_file, filename);
        }
      })
    };

    // extract file from file container
    reader.readAsDataURL($(this).prop('files')[0]);
    // extract the filename to be used later
    filename = $(this).prop('files')[0].name.split(".")[0];
});


function cleanUrls(element, download, summary) {
    // clean output containers from link

    // link list
    $(element).text("");

    // p containing the number of found links
    $(summary).text("Ricerca in corso...");

    // download button
    $(download).attr({
        "href": "",
        "download": "",
        "active": "false"
    });

    // download label
    $(download).children().attr({
        "active": "false"
    });
}


function extractUrls(text, prefix) {
    // extracs urls from html text, regex thanks to https://github.com/valerionew
    let re = /\/playback\/.{36}/g;
    let urls = text.match(re);

    if (urls === null) {
        return [];
    }

    // we convert the list into a set (and then back) to remove duplicates
    let urls_set = new Set(urls);
    let unique_urls = [];
    urls_set.forEach(function(item) {
        // while reconverting, we add the prefix (the base url)
        unique_urls.push(prefix + item);
    });

    return unique_urls;
}


function showUrls(urls, element, summary) {
  // shows url list in output
    if (urls.length > 0) {
        if (urls.length > 1) {
            $(summary).text(`Sono stati trovati ${urls.length} link nel file:`);
        } else {
            $(summary).text(`È stato trovato 1 link nel file:`);
        }

        urls.forEach(function(item) {
            $(element).append(`<span id="link"><a href="${item}">${item}</a></span><br>`);
        });
    } else {
        $(summary).text('Non sono stati trovati link nel file!');
    }
}

function attachDownload(urls, element, filename) {
    // create downloadable file
    let prefix = "data:text/plain;base64,";
    let filetype = ".txt";
    let output = "";
    let output_encoded;

    urls.forEach(function(item) {
        output += item + '\r\n';
    });

    // base64 encoding because firefox doesn't like plaintext
    output_encoded = btoa(output);

    // download button
    $(element).attr({
        "href": prefix + output_encoded,
        "download": filename + filetype,
        "active": "true"
    });
    // download label
    $(element).children().attr({
        "active": "true"
    });
}
