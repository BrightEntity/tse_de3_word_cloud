import * as d3 from 'd3'
import * as cloud from './d3-cloud'

// Mon métier = Réalisateur
// 1) le tableau en dehors du fichier (chargé)
// 2) "interactivité"
// 3) pie chart
// 4) bonus

console.log('Hello World from your main file!');

const width = document.getElementById("container").offsetWidth * 0.95,
    height = 500,
    fontFamily = "Open Sans",
    fontScale = d3.scaleLinear().range([20, 120]), // Construction d'une échelle linéaire continue qui va d'une font de 20px à 120px
    fillScale = d3.scaleOrdinal(d3.schemeCategory10); // Construction d'une échelle discrète composée de 10 couleurs différentes

d3.dsv(";", 'assets/realisateurs_le_plus_diffuses.csv').then(function(csv) {
    var words = [];

    words = csv.reduce((acc, n) => {

        if(acc.filter(m => m.text == n['réalisateur(s)']).length > 0 ) {
            acc.find(m => m.text == n['réalisateur(s)']).size += Number(n['nb. de diffusions']);
        } else {
            acc.push({
                'text': n['réalisateur(s)'],
                'size': Number(n['nb. de diffusions'])
            });
        }

        return acc;
    }, []);

    /*
    csv.forEach(function(e,i) {
        words.push({"text": e['réalisateur(s)'], "size": +e.reduce((n, acc) => n['réalisateur(s)'] == e["réalisateur(s)"] ? n.count : acc, 0)  });
    });
    */

    words.length = 100;

    // Nous essayons de déterminer la font-size maximale que nous pouvons utiliser.
    // Pour cela nous plaçons dans la page le mot avec le plus d'occurence et récupérons la taille qu'il occupe en pixels avec une font de "500px"
    // Voir le code source et le DIV avec un id = test-width associé à un CSS portant le même nom
    // Grâce à une règle de trois et l'utilisation de la largeur de notre SVG nous obtenons une maxFontSize qui garantie que le mot passera dans le SVG.
    var testDiv = document.getElementById("test-width");
    testDiv.innerHTML = words[0].text;
    var testWidth = testDiv.clientWidth;
    var maxFontSize = width * 500 / testWidth;

    let minSize = d3.min(words, d => d.size);
    let maxSize = d3.max(words, d => d.size);

    computeAndDraw(words, maxFontSize);
    function computeAndDraw(tmp_words, max_font_size) { // Nous allons apeller cette fonction tant que tous les mots ne sont pas présents en sortie
        let fontScale = d3.scaleLinear()
            .domain([minSize, maxSize])
            .range([10, max_font_size]);

        cloud()
            .size([width, height])
            .words(tmp_words)
            .padding(1)
            .rotate(function() {
                return ~~(Math.random() * 2) * 45;
            })
            .spiral("rectangular")
            .font(fontFamily)
            .fontSize(function(d) { return fontScale(d.size); })
            .on("end", function(output) {
                // Le code intéressant se situe ici. Nous vérifions si l'output possède bien tous les mots.
                // Si c'est le cas nous apellons la fonction draw sinon nous rapellons computeAndDraw en diminuant max_font_size de 5px
                // A noter qu'il est nécessaire de reconstruire le tableau d'entré sinon ça ne fonctionne pas
                if (output.length !== words.length) {
                    var tmp_words = [];
                    csv.forEach(function(e,i) {
                        tmp_words.push({"text": e.LABEL, "size": +e.COUNT});
                    });
                    tmp_words.length = 100;
                    computeAndDraw(tmp_words, max_font_size - 5);
                } else {
                    draw(output);
                }
            })
            .start();

        function draw(output) {
            d3.select("#word-cloud").append("svg")
                .attr("class", "svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + ", " + height / 2 + ")")
                .selectAll("text")
                .data(output)
                .enter().append("text")
                .style("font-size", d => d.size + "px")
                .style("font-family", fontFamily)
                .style("fill", d => fillScale(d.size))
                .attr("text-anchor", "middle")
                .attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
                .text(d => d.text);
        }
    }
});