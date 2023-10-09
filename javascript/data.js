function typesCount() {
  fetch("/dados")
    .then((result) => result.json())
    .then((data) => {
      // Função para contar a quantidade de cada tipo
      function contarTipos(data) {
        const tipos = {};
        for (let i = 0; i < data.length; i++) {
          const tipo = data[i].type;
          if (tipos[tipo]) {
            tipos[tipo]++;
          } else {
            tipos[tipo] = 1;
          }
        }
        return tipos;
      }

      // Função para obter os 3 tipos com as maiores quantidades
      function obterMaioresTipos(tipos) {
        return Object.keys(tipos)
          .sort((a, b) => tipos[b] - tipos[a])
          .slice(0, 3); // Pega os 3 tipos com as maiores quantidades
      }

      function contarTipoEspecifico(data, tipo) {
        let quantidade = 0;
        for (let i = 0; i < data.length; i++) {
          if (data[i].type === tipo) {
            quantidade++;
          }
        }
        return quantidade;
      }

      function preencherDivsComTipos(maioresTipos) {
        const type1Name = document.getElementById("type1_name");
        const type2Name = document.getElementById("type2_name");
        const type3Name = document.getElementById("type3_name");

        type1Name.textContent = maioresTipos[0] || "Nenhum tipo encontrado";
        type2Name.textContent = maioresTipos[1] || "";
        type3Name.textContent = maioresTipos[2] || "";

        const type1Desc = document.getElementById("type1_desc");
        const type2Desc = document.getElementById("type2_desc");
        const type3Desc = document.getElementById("type3_desc");

        type1Desc.textContent = `Encontrado(s) ${
          contarTipoEspecifico(data, maioresTipos[0]) ||
          "Nenhum tipo encontrado"
        } dados deste tipo.`;
        type2Desc.textContent = `Encontrado(s) ${
          contarTipoEspecifico(data, maioresTipos[1]) || ""
        } dados deste tipo.`;
        type3Desc.textContent = `Encontrado(s) ${
          contarTipoEspecifico(data, maioresTipos[2]) || ""
        } dados deste tipo.`;
      }

      const tiposContados = contarTipos(data);
      const maioresTipos = obterMaioresTipos(tiposContados);

      preencherDivsComTipos(maioresTipos);
    });
}

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
        dataDiv.style.cursor = "pointer";
        dataDiv.onclick = () => dataMoreOpen(data[i].id);

        const dataLink = document.createElement("a");
        dataLink.style.textDecoration = "none";
        dataLink.style.display = "block";

        const dataContent = document.createElement("div");
        dataContent.className = "server-content";

        let imgData = "";
        if (data[i].type == "RECICLAGEM") {
          imgData =
            "https://media.discordapp.net/attachments/1039517691242877008/1161037994409603082/letra-r.png?ex=6536d7e4&is=652462e4&hm=156dafe0e16f26ffcc4f018e8f02786f0c7952493ab47edcf07630205c3accc4&=&width=140&height=140";
        } else if (data[i].type == "MIGRAÇÃO") {
          imgData =
            "https://media.discordapp.net/attachments/1039517691242877008/1161037994959061102/letra-m.png?ex=6536d7e5&is=652462e5&hm=4c6d6e06cf3e797229e019873e8435f3c5096a4695e9aea79f7b6f1247edbee8&=&width=140&height=140";
        } else if (data[i].type == "ETAPA TÉCNICA") {
          imgData =
            "https://media.discordapp.net/attachments/1039517691242877008/1161037994707386408/letra-e.png?ex=6536d7e4&is=652462e4&hm=8e61e38188639aabad2333356447c474550a90ab6c33ba39e4f81442d8c7e218&=&width=140&height=140";
        } else {
          imgData =
            "https://cdn.discordapp.com/attachments/1039517691242877008/1160931444873498645/data.png?ex=653674a9&is=6523ffa9&hm=47c2bfb3c4509878ea42730b84617b041f3c108e2425f789d707cb07bebb9955&";
        }
        const dataImage = document.createElement("img");
        dataImage.src = imgData;
        dataImage.className = "server-image";

        const dataInfo = document.createElement("div");
        dataInfo.className = "server-info";

        const dataName = document.createElement("h4");
        dataName.className = "server-name";
        dataName.style.textAlign = "left";
        dataName.textContent = `${data[i].id} ▪ ${data[i].name}`;

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
    typesCount();
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
            (guild.start_date &&
              guild.start_date.toLowerCase().includes(termo)) ||
            (guild.start_hour &&
              guild.start_hour.toLowerCase().includes(termo)) ||
            (guild.end_date && guild.end_date.toLowerCase().includes(termo)) ||
            (guild.end_hour && guild.end_hour.toLowerCase().includes(termo))
          ) {
            resultados.push(guild);
          }
        }

        if (resultados.length > 0) {
          resultados.forEach((data) => {
            const resultDiv = document.createElement("div");
            resultDiv.id = data.id;
            resultDiv.className = "server-item";
            resultDiv.style.cursor = "pointer";
            resultDiv.onclick = () => dataMoreOpen(data.id);

            const resultLink = document.createElement("a");
            resultLink.style.textDecoration = "none";
            resultLink.style.display = "block";

            const resultContent = document.createElement("div");
            resultContent.className = "server-content";

            let imgResult = "";
            if (data.type == "RECICLAGEM") {
              imgResult =
                "https://media.discordapp.net/attachments/1039517691242877008/1161037994409603082/letra-r.png?ex=6536d7e4&is=652462e4&hm=156dafe0e16f26ffcc4f018e8f02786f0c7952493ab47edcf07630205c3accc4&=&width=140&height=140";
            } else if (data.type == "MIGRAÇÃO") {
              imgResult =
                "https://media.discordapp.net/attachments/1039517691242877008/1161037994959061102/letra-m.png?ex=6536d7e5&is=652462e5&hm=4c6d6e06cf3e797229e019873e8435f3c5096a4695e9aea79f7b6f1247edbee8&=&width=140&height=140";
            } else if (data.type == "ETAPA TÉCNICA") {
              imgResult =
                "https://media.discordapp.net/attachments/1039517691242877008/1161037994707386408/letra-e.png?ex=6536d7e4&is=652462e4&hm=8e61e38188639aabad2333356447c474550a90ab6c33ba39e4f81442d8c7e218&=&width=140&height=140";
            } else {
              imgResult =
                "https://cdn.discordapp.com/attachments/1039517691242877008/1160931444873498645/data.png?ex=653674a9&is=6523ffa9&hm=47c2bfb3c4509878ea42730b84617b041f3c108e2425f789d707cb07bebb9955&";
            }

            const resultImage = document.createElement("img");
            resultImage.src = imgResult;
            resultImage.className = "server-image";

            const resultInfo = document.createElement("div");
            resultInfo.className = "server-info";

            const resultName = document.createElement("h4");
            resultName.className = "server-name";
            resultName.style.textAlign = "left";
            resultName.textContent = `${data.id} ▪ ${data.name}`;

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
