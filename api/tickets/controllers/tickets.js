'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */


const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
    async create(ctx) {

        let { state, number, rifa, name, telefone } = ctx.request.body

        let gambler;

        let entity;

        gambler = await strapi.services.gambler.findOne({ telefone: telefone })
        //console.log(gambler.gambler_tickets);




        if (state === 'reserved') {

            await strapi.services.tickets.findOne({ number: number }).
                then(async function (response) {
                    if (response == null) {

                        entity = await strapi.services.tickets.create({ state, number, rifa });

                    } else if (response.rifa.id !== rifa) { /* caso esse numero ja existir no registro,
                                                             cadastrar apenas se for de uma rifa diferente */
                        //console.log('número já encontrado, mas como é uma rifa diferente, vô deixá passá!');
                        entity = await strapi.services.tickets.create({ state, number, rifa });
                    }
                })

        } else {
            return ('Somethin\' unexpected happenend.')
        }

        if (gambler === null) { //ainda nao cadastrado

            //gambler.gambler_tickets.push(entity)
            gambler = await strapi.services.gambler.create({ name, telefone });

            gambler.gambler_tickets.push(entity)

            await strapi.services.gambler.update({ telefone: telefone }, gambler);

            return sanitizeEntity(gambler, { model: strapi.models.tickets });

        }
        else if (gambler !== null) { //ja ta cadastrado no sistema

            gambler.gambler_tickets.push(entity)
            await strapi.services.gambler.update({ telefone: telefone }, gambler);
            return sanitizeEntity(gambler, { model: strapi.models.tickets });

        }

        //gambler = await strapi.services.gambler.create({ name, telefone, id }) //colocar o id certo... continuar dps

        return sanitizeEntity(gambler, { model: strapi.models.tickets });
    },
};
