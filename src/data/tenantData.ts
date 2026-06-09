import type { CustomPage } from '@/types/tenant';

export interface FactoryData {
  id: string;
  name: string;
  code: string;
  industry: string;
  ownerName: string;
  ownerMobile: string;
  ownerEmail: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  planId: string;
  status: 'active' | 'suspended' | 'trial' | 'expired';
  createdAt: string;
  expiresAt: string;
  enabledModules: string[];
}

export const factories: FactoryData[] = [
  {
    id: 'FAC-001', name: 'فولاد مبارکه اصفهان', code: 'MOB', industry: 'فولاد و فلزات',
    ownerName: 'مهندس احمدی', ownerMobile: '09131111111', ownerEmail: 'info@mobarakeh.ir',
    address: 'اصفهان، کیلومتر ۵ جاده مبارکه', city: 'اصفهان', province: 'اصفهان', postalCode: '8178612345',
    planId: 'PL-003', status: 'active', createdAt: '1402/01/01', expiresAt: '1405/12/29',
    enabledModules: ['command-center','mes','idp','alerts','wms','srm','cmms','qms','hse','hrm','dms','finance','ai','report-builder'],
  },
  {
    id: 'FAC-002', name: 'پتروشیمی پارس', code: 'PTP', industry: 'پتروشیمی',
    ownerName: 'دکتر رضایی', ownerMobile: '09132222222', ownerEmail: 'info@parspetro.ir',
    address: 'عسلویه، منطقه ویژه پارس', city: 'عسلویه', province: 'بوشهر', postalCode: '7531912345',
    planId: 'PL-002', status: 'active', createdAt: '1402/06/01', expiresAt: '1404/12/29',
    enabledModules: ['command-center','idp','wms','cmms','qms','lims','hse','finance','ai'],
  },
  {
    id: 'FAC-003', name: 'خودروسازی سینا', code: 'SIN', industry: 'خودروسازی',
    ownerName: 'مهندس نوری', ownerMobile: '09133333333', ownerEmail: 'info@sinakhodro.ir',
    address: 'تهران، کیلومتر ۱۵ جاده خاوران', city: 'تهران', province: 'تهران', postalCode: '1836512345',
    planId: 'PL-003', status: 'active', createdAt: '1401/10/15', expiresAt: '1405/10/15',
    enabledModules: ['command-center','mes','srm','qms','hse','hrm','dms','ai','report-builder','form-builder'],
  },
];

export const customPages: CustomPage[] = [
  { id:'CP-001', title:'ثبت دمای کوره', category:'plc', factoryId:'FAC-001', schema:[
    { name:'temp', label:'دما (C°)', type:'number', required:true, placeholder:'۱۵۰۰' },
    { name:'zone', label:'منطقه', type:'select', required:true, options:[{ value:'zone1', label:'Zone 1' },{ value:'zone2', label:'Zone 2' }] },
  ]},
  { id:'CP-002', title:'آنالیز آزمایشگاهی', category:'lab', factoryId:'FAC-001', schema:[
    { name:'sample_id', label:'کد نمونه', type:'text', required:true },
    { name:'result', label:'نتیجه', type:'textarea', required:true },
  ]},
  { id:'CP-003', title:'گزارش تولید روزانه', category:'form', factoryId:'FAC-001', schema:[
    { name:'shift', label:'شیفت', type:'select', required:true, options:[{ value:'morning', label:'صبح' },{ value:'evening', label:'عصر' }] },
    { name:'output_qty', label:'تعداد تولید', type:'number', required:true },
  ]},
  { id:'CP-004', title:'ثبت فشار مخازن', category:'plc', factoryId:'FAC-002', schema:[
    { name:'tank_id', label:'شماره مخزن', type:'text', required:true },
    { name:'pressure', label:'فشار (bar)', type:'number', required:true },
  ]},
  { id:'CP-005', title:'آنالیز مواد پتروشیمی', category:'lab', factoryId:'FAC-002', schema:[
    { name:'material', label:'ماده', type:'text', required:true },
    { name:'purity', label:'خلوص %', type:'number', required:true },
  ]},
  { id:'CP-006', title:'فرم کنترل کیفیت', category:'form', factoryId:'FAC-003', schema:[
    { name:'product', label:'محصول', type:'text', required:true },
    { name:'inspector', label:'بازرس', type:'text', required:true },
    { name:'result', label:'نتیجه', type:'select', required:true, options:[{ value:'pass', label:'قبول' },{ value:'fail', label:'رد' }] },
  ]},
];

export const licenses = [
  { id:'LIC-001', tenantId:'FAC-001', licenseKey:'FOS-MOB-2024-A1B2C3D4', planName:'Enterprise', modules: factories[0].enabledModules, userLimit:250, expiryDate:'1405/12/29', status:'active' },
  { id:'LIC-002', tenantId:'FAC-002', licenseKey:'FOS-PTP-2024-E5F6G7H8', planName:'Professional', modules: factories[1].enabledModules, userLimit:100, expiryDate:'1404/12/29', status:'active' },
  { id:'LIC-003', tenantId:'FAC-003', licenseKey:'FOS-SIN-2024-I9J0K1L2', planName:'Enterprise', modules: factories[2].enabledModules, userLimit:200, expiryDate:'1405/10/15', status:'active' },
];
