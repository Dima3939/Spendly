const fs = require('fs');
let c = fs.readFileSync('src/i18n.js', 'utf8');

// A quick and dirty way to inject these globally
c = c.replace(/navOverview/g, "save: 'Save', cancel: 'Cancel', navOverview");

// Let's replace the specific ones
c = c.replace(/save: 'Save', cancel: 'Cancel', navOverview: 'Обзор'/g, "save: 'Сохранить', cancel: 'Отмена', navOverview: 'Обзор'");
c = c.replace(/save: 'Save', cancel: 'Cancel', navOverview: 'Огляд'/g, "save: 'Зберегти', cancel: 'Скасувати', navOverview: 'Огляд'");
c = c.replace(/save: 'Save', cancel: 'Cancel', navOverview: 'Übersicht'/g, "save: 'Speichern', cancel: 'Abbrechen', navOverview: 'Übersicht'");
c = c.replace(/save: 'Save', cancel: 'Cancel', navOverview: 'Resumen'/g, "save: 'Guardar', cancel: 'Cancelar', navOverview: 'Resumen'");
c = c.replace(/save: 'Save', cancel: 'Cancel', navOverview: 'Aperçu'/g, "save: 'Enregistrer', cancel: 'Annuler', navOverview: 'Aperçu'");
c = c.replace(/save: 'Save', cancel: 'Cancel', navOverview: 'نظرة عامة'/g, "save: 'حفظ', cancel: 'إلغاء', navOverview: 'نظرة عامة'");
c = c.replace(/save: 'Save', cancel: 'Cancel', navOverview: '概览'/g, "save: '保存', cancel: '取消', navOverview: '概览'");

fs.writeFileSync('src/i18n.js', c, 'utf8');
console.log('Injected save/cancel');
