fetch("/dados")
  .then((result) => result.json())
  .then((data) => {
    const dataContainer = document.getElementById("allData");
    const loadingIconDatas = document.getElementById("loadingIconDatas");
    loadingIconDatas.style.display = "none";

    function loadData() {
      for (let i = 0; i < data.length; i++) {
        const dataDiv = document.createElement("div");
        dataDiv.id = data[i].id;
        dataDiv.className = "server-item";

        const dataLink = document.createElement("a");
        dataLink.href = `/data/${data[i].id}`;
        dataLink.style.textDecoration = "none";
        dataLink.style.display = "block";

        const dataContent = document.createElement("div");
        dataContent.className = "server-content";

        const imgData =
          "https://cdn.discordapp.com/attachments/1039517691242877008/1160931444873498645/data.png?ex=653674a9&is=6523ffa9&hm=47c2bfb3c4509878ea42730b84617b041f3c108e2425f789d707cb07bebb9955&";

        const dataImage = document.createElement("img");
        dataImage.src = imgData;
        dataImage.className = "server-image";

        const dataInfo = document.createElement("div");
        dataInfo.className = "server-info";

        const dataName = document.createElement("h4");
        dataName.className = "server-name";
        dataName.style.textAlign = "left";
        dataName.textContent = data[i].name;

        const descData = document.createElement("p");
        descData.style.textAlign = "left";
        descData.className = "server-description";
        descData.textContent = `${data[i].responsible} • ${data[i].start_date} (${data[i].start_hour}) — ${data[i].end_date} (${data[i].end_hour})`;

        dataInfo.appendChild(dataName);
        dataInfo.appendChild(descData);

        dataContent.appendChild(dataImage);
        dataContent.appendChild(dataInfo);

        dataLink.appendChild(dataContent);
        dataDiv.appendChild(dataLink);
        dataContainer.appendChild(dataDiv);
      }
    }

    document.getElementById(
      "datasDescTitle"
    ).innerText = `Abaixo estão todas as informações encontradas! Foram encontrada(s) ${data.length} informações neste excel.`;

    loadData();
  });

function pesquisar() {
  fetch("/dados")
    .then((result) => result.json())
    .then((data) => {
      function search() {
        const searchResultsContainer = document.getElementById("searchResults");
        searchResultsContainer.innerHTML = "";
        const termo = document
          .getElementById("searchInput")
          .value.toLowerCase();
        if (termo.trim() === "")
          return (searchResultsContainer.textContent =
            "Por favor, insira um termo de pesquisa para realizar a busca.");
        const resultados = [];

        for (let i = 0; i < data.length; i++) {
          const guild = data[i];

          if (
            guild.id.toString() === termo ||
            (guild.name && guild.name.toLowerCase().includes(termo)) ||
            (guild.responsible &&
              guild.responsible.toLowerCase().includes(termo)) ||
            (guild.data && guild.data.toLowerCase().includes(termo))
          ) {
            resultados.push(guild);
          }
        }

        if (resultados.length > 0) {
          resultados.forEach((data) => {
            const resultDiv = document.createElement("div");
            resultDiv.id = data.id;
            resultDiv.className = "server-item";

            const resultLink = document.createElement("a");
            resultLink.href = `/data/${data.id}`;
            resultLink.style.textDecoration = "none";
            resultLink.style.display = "block";

            const resultContent = document.createElement("div");
            resultContent.className = "server-content";

            const imgResult =
              "https://cdn.discordapp.com/attachments/1039517691242877008/1160931444873498645/data.png?ex=653674a9&is=6523ffa9&hm=47c2bfb3c4509878ea42730b84617b041f3c108e2425f789d707cb07bebb9955&";

            const resultImage = document.createElement("img");
            resultImage.src = imgResult;
            resultImage.className = "server-image";

            const resultInfo = document.createElement("div");
            resultInfo.className = "server-info";

            const resultName = document.createElement("h4");
            resultName.className = "server-name";
            resultName.style.textAlign = "left";
            resultName.textContent = data.name;

            const resultResponsible = document.createElement("p");
            resultResponsible.style.textAlign = "left";
            resultResponsible.className = "server-description";
            resultResponsible.textContent = `${data.responsible} • ${data.start_date} (${data.start_hour}) — ${data.end_date} (${data.end_hour})`;

            resultInfo.appendChild(resultName);
            resultInfo.appendChild(resultResponsible);

            resultContent.appendChild(resultImage);
            resultContent.appendChild(resultInfo);

            resultLink.appendChild(resultContent);
            resultDiv.appendChild(resultLink);
            searchResultsContainer.appendChild(resultDiv);
          });
        } else {
          searchResultsContainer.textContent =
            "Nenhum resultado foi encontrado com base no termo de busca fornecido.";
        }
      }

      search();
    });
}
