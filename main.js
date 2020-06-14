$(document).ready(function(){
    moment.locale('it');

    var chiamata_api = 'http://157.230.17.132:4016/sales';
    $.ajax({
        // specifico la URL della risorsa da contattare
        'url' : chiamata_api,
        'method' : 'GET',
        // imposto un'azione per il caso di successo
        'success' :function(vendite) {

            //  in var dati_generati finisce l'OGGETTO del return
            var dati_vendite_generati = genera_vendite_mensili(vendite);
            //  questa variabile mi crea un array contenente tutte le chiavi dell'oggetto (che saranno le etichette del grafico)
            var mesi = Object.keys(dati_vendite_generati);
            // estraggo i valori, che saranno i dati del grafico
            var dati_mesi = Object.values(dati_vendite_generati);
            // le chiavi le passo alla funzione che disegna il grafico
            grafico_chart_vendite_mensili(mesi, dati_mesi);

            // GRAFICO 2: VENDITORI
            var dati_vendite_venditori = genera_numeri_venditori(vendite);
            var nomi_venditori = Object.keys(dati_vendite_venditori);
            var dati_venditori = Object.values(dati_vendite_venditori);
            grafico_chart_vendite_venditori(nomi_venditori, dati_venditori);

            //OPZIONE 2 ciò che arriva dall'API, la passo alla funzione
            // genera_vendite_mensili(vendite);
        },
        // ed una per il caso di fallimento
        'error' :function(){
            console.log("Chiamata fallita!!!");
        }
    });

    // la funzione genera_vendite_mensili elabora i dati
    function genera_vendite_mensili(dati){
        // creo un oggetto dove faccio partire l'ammontare da zero, così che si sommino le cifre delle interazione
        var vendite_mensili = {
            'gennaio' : 0,
            'febbraio' : 0,
            'marzo' : 0,
            'aprile' : 0,
            'maggio' : 0,
            'giugno' : 0,
            'luglio' : 0,
            'agosto' : 0,
            'settembre' : 0,
            'ottobre' : 0,
            'novembre' : 0,
            'dicembre' : 0,
        };

        // ciclo le proprietà della chiamata
        for (var i = 0; i < dati.length; i++) {
            // recupero la vendita mensile effettuata
            var vendita_singola = dati[i];
            // console.log(vendita_singola);
            // leggo le proprietà .amount e.date dell'oggetto che mi arriva dal server
            // recupero l'ammontare della vendita
            var ammontare = parseInt(vendita_singola.amount);
            // recupero la data della vendita mensile
            var data_vendita = vendita_singola.date;
            // console.log(ammontare, data_vendita);
            // diciamo a moment di leggere le date nel formato 'DD/MM/YYYY'. costruisco l'oggetto moment a partire dalla data della vendita corrente
            var data_moment = moment(data_vendita, 'DD/MM/YYYY');
            // e poi leggerò il mese in italiano ed in formato testuale
            moment.locale('it');
            // accedo alla chiave [mese_vendita]
            var mese_vendita = data_moment.format('MMMM');
            // console.log(mese_vendita);
            // faccio la concatenazione per semplificare la somma
            //  e poi incremento ad ogni interazione dell'importo corrente
            // utilizzo mese_vendita come chiave per leggere la proprietà dell'oggetto
            vendite_mensili[mese_vendita] += ammontare;
            // console.log(vendite_mensili[mese_vendita]);
        };  // chiudo il ciclo for

        // la funzione vendite_mensili_generate richiama la funzione:
        // passandogli l'oggetto che ha appena costruito OPZIONE 2
        // grafico_chart_vendite_mensili(vendite_mensili);

        //  restituisce l'oggetto
        return vendite_mensili;
    }; // chiudo function genera_vendite_mensili

    function genera_numeri_venditori(dati){
        var vendite_venditori = {};

        for (var i = 0; i < dati.length; i++) {
            // recupero la vendita corrente
            var vendita_singola = dati[i];
            // recupero l'importo della vendita corrente
            var ammontare = parseInt(vendita_singola.amount);
            // recupero il nome del venditore della vendita corrente
            var nome_corrente = vendita_singola.salesman;
            // se nelle iterazioni precenti è già uscito il nome del venditore
            if (vendite_venditori.hasOwnProperty(nome_corrente)) {
                // sommo la nuova cifra della vendita
                vendite_venditori[nome_corrente] += ammontare;
            } else {
                // altrimenti, la inizializzo
                vendite_venditori[nome_corrente] = ammontare;
            }
        }
        return vendite_venditori;
    }

    function grafico_chart_vendite_mensili(labels, dati) {

        var ctx = document.getElementById('quota-vendite').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: "Fatturati mensili nell'anno 2017",
                    data: dati,
                    pointBackgroundColor: 'rgb(139, 0, 139)',
                    pointBorderColor: 'rgb(139, 0, 139)',
                    borderColor: 'rgb(0, 100, 0)',
                    borderWidth: 2,
                    fill:false
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }  // grafico_chart_vendite_mensili CHIUSO

    function grafico_chart_vendite_venditori(labels, dati){

        var ctx = document.getElementById('quota-venditori').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: "Fatturati mensili nell'anno 2017",
                    data: dati,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
        });
    };
});
