const pieCanvas = document.getElementById("pieCanvas").getContext("2d");

const pieChart = new Chart(pieCanvas, {
  type: "pie",
  data: data,
});

const data = {
  labels: ["Séries", "Films", "Documentaires"],
  datasets: [
    {
      label: "My First Dataset",
      data: [300, 50, 100],
      backgroundColor: [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 205, 86)",
      ],
      hoverOffset: 4,
    },
  ],
};
