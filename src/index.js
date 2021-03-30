import * as d3 from 'd3'
import * as cloud from './d3-cloud'
import 'materialize-css/dist/css/materialize.css'

import wordCloudJournaliste from "./word-cloud-journaliste";
import wordCloudRealisateur from './word-cloud-realisateur'
import pieChartJournalistes from "./pie_chart_journalistes";
import bubbleChartJournalistes from "./bubble_chart_journalistes";
import pieChartRealisateurs from "./pie_chart_realisateurs";
import bubbleChartRealisateurs from "./bubble-chart-realisateurs";

// Mon métier = Réalisateur
// 1) le tableau en dehors du fichier (chargé)
// 2) "interactivité"
// 3) pie chart
// 4) bonus

console.log('Hello World from your main file!');

wordCloudJournaliste();
wordCloudRealisateur();
pieChartRealisateurs();
pieChartJournalistes();
bubbleChartJournalistes();
bubbleChartRealisateurs();