public with sharing class JestDemoController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(){
        try {
            return [SELECT Id, Name FROM Account LIMIT 5];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<Case> getCases(){
        try {
            return [SELECT Id, Subject FROM Case LIMIT 5];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}