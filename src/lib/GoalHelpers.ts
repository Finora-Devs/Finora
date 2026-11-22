import { SavingGoal } from "./types_and_helpers";




export function getNumActiveGoals(savingGoalArr: SavingGoal[])
{
    let numActive = 0;
    for(let i = 0; i < savingGoalArr.length; i++)
    {
        if(isActive(savingGoalArr[i])) numActive += 1;
    }
    return numActive;
}
export function getNumCompletedGoals(savingGoalArr: SavingGoal[]) {
    let numComplete = 0;
    for(let i = 0; i < savingGoalArr.length; i++)
    {
        if(!isActive(savingGoalArr[i])) numComplete += 1;
    }
    return numComplete;
}
export function getTotalContributions(savingGoalArr: SavingGoal[])
{
    let total = 0;
    savingGoalArr.forEach((goal) => 
        {
            if(isActive(goal)) total += goal.currentAmount;
        });
    return total;
}
export function getRemainingContributions(savingGoalArr: SavingGoal[])
{
    let total = 0;
    savingGoalArr.forEach((goal) => 
        {
            if(isActive(goal)) total += goal.targetAmount - goal.currentAmount ;
        });
    return total;
}




function isActive(savingGoal: SavingGoal)
{
    return savingGoal.currentAmount < savingGoal.targetAmount;
}