const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'postman', 'sports-management-api-participante-b.postman_collection.json');
const col = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// 1. Enriquecer carpeta 2: Posiciones Espaciales
const folderPos = col.item.find(i => i.name.startsWith('2.'));
if (folderPos) {
  folderPos.item.push(
    {
      name: 'HU-GC-09: Registrar Posiciones en Lote (Simulador/Pizarra)',
      request: {
        method: 'POST',
        header: [
          { key: 'Authorization', value: 'Bearer {{token}}' },
          { key: 'x-bypass-security', value: 'true' },
          { key: 'Content-Type', value: 'application/json' }
        ],
        body: {
          mode: 'raw',
          raw: JSON.stringify({
            posiciones: [
              { esPelota: true, x: 0.55, y: 0.52 },
              { jugadorId: 1, x: 0.18, y: 0.49 },
              { jugadorId: 2, x: 0.48, y: 0.40 }
            ]
          }, null, 2)
        },
        url: { raw: '{{baseUrl}}/partidos/1/posiciones', host: ['{{baseUrl}}'], path: ['partidos', '1', 'posiciones'] }
      },
      event: [{
        listen: 'test',
        script: {
          exec: [
            'pm.test("Status code es 201", function () { pm.response.to.have.status(201); });',
            'pm.test("Retorna lista de posiciones registradas", function () { var j = pm.response.json(); pm.expect(Array.isArray(j)).to.be.true; });'
          ]
        }
      }]
    },
    {
      name: 'HU-GC-09: Consultar Ultimas Posiciones en Vivo',
      request: {
        method: 'GET',
        header: [
          { key: 'Authorization', value: 'Bearer {{token}}' },
          { key: 'x-bypass-security', value: 'true' }
        ],
        url: { raw: '{{baseUrl}}/partidos/1/posiciones/ultimas', host: ['{{baseUrl}}'], path: ['partidos', '1', 'posiciones', 'ultimas'] }
      },
      event: [{
        listen: 'test',
        script: {
          exec: [
            'pm.test("Status code es 200", function () { pm.response.to.have.status(200); });',
            'pm.test("Retorna ultimas posiciones de jugadores y pelota", function () { var j = pm.response.json(); pm.expect(Array.isArray(j)).to.be.true; });'
          ]
        }
      }]
    }
  );
}

// 2. Enriquecer carpeta 3: Partidos
const folderPart = col.item.find(i => i.name.startsWith('3.'));
if (folderPart) {
  folderPart.item.push({
    name: 'HU-GC-07/11: Finalizar Partido y Liquidar Apuestas',
    request: {
      method: 'POST',
      header: [
        { key: 'Authorization', value: 'Bearer {{token}}' },
        { key: 'x-bypass-security', value: 'true' },
        { key: 'Content-Type', value: 'application/json' }
      ],
      body: {
        mode: 'raw',
        raw: JSON.stringify({ id_equipo_ganador: 1, es_empate: false }, null, 2)
      },
      url: { raw: '{{baseUrl}}/partidos/1/finalizar', host: ['{{baseUrl}}'], path: ['partidos', '1', 'finalizar'] }
    },
    event: [{
      listen: 'test',
      script: {
        exec: [
          'pm.test("Status code es 201", function () { pm.response.to.have.status(201); });',
          'pm.test("Confirma liquidacion de apuestas", function () { var j = pm.response.json(); pm.expect(j.success).to.be.true; });'
        ]
      }
    }]
  });
}

// 3. Carpeta 8: Habilidades de Jugador
col.item.push({
  name: '8. Habilidades de Jugadores (HU-GD-07 / HU-GD-08)',
  item: [
    {
      name: 'HU-GD-08: Consultar Habilidades de Jugador (Contrato B -> A)',
      request: {
        method: 'GET',
        header: [
          { key: 'Authorization', value: 'Bearer {{token}}' },
          { key: 'x-bypass-security', value: 'true' }
        ],
        url: { raw: '{{baseUrl}}/jugadores/1/habilidades', host: ['{{baseUrl}}'], path: ['jugadores', '1', 'habilidades'] }
      },
      event: [{
        listen: 'test',
        script: {
          exec: [
            'pm.test("Status code es 200", function () { pm.response.to.have.status(200); });',
            'pm.test("Retorna lista de habilidades", function () { var j = pm.response.json(); pm.expect(Array.isArray(j)).to.be.true; });'
          ]
        }
      }]
    },
    {
      name: 'HU-GD-07: Asignar Habilidad a Jugador',
      request: {
        method: 'POST',
        header: [
          { key: 'Authorization', value: 'Bearer {{token}}' },
          { key: 'x-bypass-security', value: 'true' }
        ],
        url: { raw: '{{baseUrl}}/jugadores/1/habilidades/4', host: ['{{baseUrl}}'], path: ['jugadores', '1', 'habilidades', '4'] }
      },
      event: [{
        listen: 'test',
        script: {
          exec: ['pm.test("Status code es 201 o 409", function () { pm.expect([201, 409]).to.include(pm.response.code); });']
        }
      }]
    }
  ]
});

fs.writeFileSync(filePath, JSON.stringify(col, null, 2), 'utf8');
console.log('Postman collection actualizada exitosamente en:', filePath);
