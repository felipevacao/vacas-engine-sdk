import { UserService } from '../src/core/modules/users/service';
import { db } from '../src/core/utils/db'; 

async function testBulkTransaction() {
    const service = new UserService();
    
    // Supondo que a tabela seja 'users' e 'name' seja obrigatório. 
    // Vamos enviar um nome inválido (null) para disparar erro.
    const bulkData = [
        { name: 'Sucesso Teste Real' }, 
        { name: null } 
    ];

    console.log("--- Iniciando Teste Integrado de Transação Bulk ---");

    try {
        await service.createMany(bulkData as any);
        console.error("❌ FALHA: O serviço deveria ter lançado erro!");
    } catch (error) {
        console.log("✅ Transação abortada com sucesso.");
        
        // Verificar no banco se o registro não foi persistido
        const inserted = await db('users').where('name', 'Sucesso Teste Real').first();
        if (!inserted) {
            console.log("✅ VALIDAÇÃO: Rollback verificado! Nenhum registro foi persistido.");
        } else {
            console.error(`❌ FALHA: O registro foi persistido! ID: ${inserted.id}`);
        }
    }
    process.exit();
}

testBulkTransaction();