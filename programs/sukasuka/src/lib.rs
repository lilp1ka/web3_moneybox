use anchor_lang::{accounts::account, prelude::*};

declare_id!("BBWxojjkikdbGWPQThCDSC7tHP5AYc6GMPcsNRPvzAjP");

#[program]
pub mod sukasuka {
    use anchor_lang::{solana_program::{entrypoint::ProgramResult, stake::instruction}, system_program::CreateAccount};

    use super::*;

    pub fn create(ctx: Context<Create>, name: String, goal:u64) -> ProgramResult{
        let money_box = &mut ctx.accounts.money_box;
        money_box.admin = *ctx.accounts.user.key;
        money_box.name = name;
        money_box.goal = goal;
        money_box.balance = 0;

        Ok(())
    }

    pub fn donate(ctx: Context<Donate>, amount:u64) -> ProgramResult{
        let money_box = &mut ctx.accounts.money_box;
        let donater = &mut ctx.accounts.donater;
        let instruction = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.donater.key,
            &ctx.accounts.money_box.key(),
            amount
        );
        anchor_lang::solana_program::program::invoke(&instruction, &[
            ctx.accounts.donater.to_account_info(),
            ctx.accounts.money_box.to_account_info()
         ]);
         
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount:u64) -> ProgramResult{
        let money_box = &mut ctx.accounts.money_box;
        let reciver = &mut ctx.accounts.reciver;
        
        if money_box.admin != *reciver.key{
            return Err(ProgramError::IllegalOwner);
        }
        
        let rent_balance = Rent::get()?.minimum_balance(money_box.to_account_info().data_len());
        
        if **money_box.to_account_info().lamports.borrow() - rent_balance < amount{
            return Err(ProgramError::InsufficientFunds);
        }

        **money_box.to_account_info().try_borrow_mut_lamports()? -= amount;
        **reciver.to_account_info().try_borrow_mut_lamports()? += amount;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Create<'info>{
    #[account(
        init,
        payer=user,
        space=1024 * 5
    )]
    pub money_box: Account<'info, MoneyBox>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[account]
pub struct MoneyBox{
    pub admin: Pubkey,
    pub name: String,
    pub goal: u64,
    pub balance: u64
}

#[derive(Accounts)]
pub struct Donate<'info>{
    #[account(mut)]
    pub money_box: Account<'info, MoneyBox>,
    #[account(mut)]
    pub donater: Signer<'info>, 
    pub system_program: Program<'info, System>

}

#[derive(Accounts)]
pub struct Withdraw<'info>{
    #[account(mut)]
    pub money_box: Account<'info, MoneyBox>,
    #[account(mut)]
    pub reciver: Signer<'info>,
    // pub system_program: Program<'info, System>
}


        // seeds=[b"CREATE_BOX".as_ref(), user.key().as_ref()],
        // bump