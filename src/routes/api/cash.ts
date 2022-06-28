import mysql from 'mysql';
import {
    StatusCodes,
} from 'http-status-codes';
import type { Cashflow } from '$lib/types';
import util from 'util';

export async function get() {
    const conn = mysql.createConnection({
        host: '10.168.1.185',
        user: 'test',
        password: 'xlzc1234',
        database: 'trade'
    });
    conn.connect();

    // node.js native promisify
    const query = util.promisify(conn.query).bind(conn);
    const results = await query(`SELECT id, strategy,
    fund_account as fundAccount,
    fund_flow as fundFlow, 
    t
    from c_bond_fut_fund_flow`) as Cashflow[];
    conn.end();
    return {
        status: 200,
        body: results,
    }
}


export async function post() {
    return {
        status: StatusCodes.CREATED,
    }
}