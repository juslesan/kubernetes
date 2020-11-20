# Devops With Kubernets course
University of Helsinki open https://devopswithkubernetes.com/part0/

## Exercise 3.06: DBaaS vs DIY

### DBaaS Pros
- Less complexity
- Easier to maintain
- Easier to setup 
- Easier to setup backups
- Error handling may come as a service
- Better default

### DBaaS Cons
- Less flexibility
- Restricted backup methodes

### DIY Pros
- Less maintainance cost
- More flexibility
- More configurability for backups


### DIY cons
- More complexity
- Could have higher development costs
- Expected to to require more work
- Backups need to be selfconfigured
- Reliability may have to be selfconfigured
- Error handling

## Exercise 3.07: Commitment

I decided to continue using Postgre with PersistentVolumeClaims. This is mainly because I already have the existing configuration. I would also like to get some additional experience with configuring postgre with kubernets isntead of using DBaaS.

## Exercise 3.10: Project v1.6

[logging](logs.png)