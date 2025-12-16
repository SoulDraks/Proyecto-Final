const {dbGet, dbAll, dbRun} = require("../Utils/Querys");

async function ObtenerMesas(req, res)
{
    const Mesas = await dbAll(`SELECT * FROM Mesas`);
    return res.status(200).json(Mesas);
}

async function AgregarMesa(req, res)
{
    let {Estado, Personas, ID_Cliente} = req.body;
    Estado = Estado || "Libre";
    Personas = Personas || 0;
    ID_Cliente = ID_Cliente || null;
    await dbRun(`
        INSERT INTO Mesas(Estado, Personas, ID_Cliente)
        VALUES(?, ?, ?)
    `, [Estado, Personas, ID_Cliente]);
    return res.status(200).json({success: true});
}

async function ModificarMesa(req, res) {
    const {ID, Estado, Personas, ID_Cliente} = req.body;
    await dbRun(`
        UPDATE Mesas
        SET Estado = ?, Personas = ?, ID_Cliente = ?
        WHERE ID = ?
    `, [Estado, Personas, ID_Cliente, ID]);
    return res.status(200).json({success: true});
}

async function EliminarMesa(req, res) {
    const {ID} = req.body;
    await dbRun(`
        DELETE FROM Mesas
        WHERE ID = ?
    `, [ID]);
    return res.status(200).json({success: true});
}

async function PedirMesa(req, res) {
    const {ID, Personas} = req.body;
    await dbRun(`
        UPDATE Mesas
        SET Estado = "Ocupado", Personas = ?
        WHERE ID = ?
    `, [Personas, ID])
    return res.status(200).json({success: true});
}

module.exports = {
    ObtenerMesas,
    AgregarMesa,
    ModificarMesa,
    EliminarMesa,
    PedirMesa
};