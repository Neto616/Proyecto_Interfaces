import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";

function Graph({ width, height, typeGraph = "bar", info = []}){
    const chartRef = useRef(null);

    useEffect(()=>{
        const ctx = chartRef.current.getContext("2d");
        const gasto_total = info.data?.map(e=>{ 
            if (e.hasOwnProperty("gasto_total")){
                return e.gasto_total;
            }else if (e.hasOwnProperty("ingreso_total")){
                return e.ingreso_total;
            }
        });
        const categoria_titulo = info.data?.map(e=> {
            if(e.hasOwnProperty("categoria_titulo")){
                return e.categoria_titulo;
            }else {
                return "Gastos", "Ingresos"
            }
        });
        console.log(`Gasto total: ${gasto_total}\nCategoria titulo: ${categoria_titulo}`);
        const graph = new Chart(ctx, {
            type: typeGraph,
            data: {
                labels: categoria_titulo ?? ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: '# of Votes',
                    data: gasto_total ?? [12, 19, 3, 5, 2, 3],
                    backgroundColor: info?.data?.colors ?? [
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
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                      }
                }
            }
        })

        return () => graph.destroy();
    }, 
    [info, typeGraph])

    return (
        <div style={{width: width, height: height}}>
         <canvas ref={chartRef} ></canvas>
        </div>
    );
}

export default Graph;