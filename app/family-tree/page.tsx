'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

// ════════════════════════════════════════════════════════════════
// ECHO PRIME TECHNOLOGIES — McWilliams Family Archive
// Commander: Bobby Don McWilliams II
// Primary source: Family Register (handwritten document)
// Bloodlines: Parker · Custer · Sellers · Castleberry · Wall · Hollmig
// ════════════════════════════════════════════════════════════════

const NAV_ITEMS = [
  { label: 'Engines', href: '/engines' },
  { label: 'Permian', href: '/permian' },
  { label: 'Services', href: '/services' },
  { label: 'Sentinel AI', href: '/sentinel' },
];

const BLOODLINES = [
  {
    icon: '🏹',
    title: 'The Parker Line',
    sub: 'Quanah Parker Connection',
    desc: 'Uma Verda Parker (b.1892) carries the Parker surname. Her mother Glenny Larcena Castleberry married a Parker man — the thread back to Quanah Parker\'s descendants or the Fort Parker settler family.',
    color: '#9e44cc',
    bg: 'rgba(158,68,204,0.08)',
    border: 'rgba(158,68,204,0.3)',
    status: 'Active Research',
    statusColor: 'rgba(239,159,39,0.15)',
    statusText: '#fac775',
  },
  {
    icon: '⚔️',
    title: 'The Custer Line',
    sub: 'IDella Ann Custer',
    desc: 'IDella Ann Custer (b. Aug 31, 1870 · d. May 10, 1959) married Oliver Lofton Sellers on Dec 23, 1886 in Bandera, TX. Maiden name Custer confirmed by primary document. Geni.com "Custer Web Site" (Raylene Sellers) has this tree partially built.',
    color: '#4a9a4a',
    bg: 'rgba(74,154,74,0.08)',
    border: 'rgba(74,154,74,0.3)',
    status: 'Primary Source Confirmed',
    statusColor: 'rgba(59,139,212,0.15)',
    statusText: '#7ab8f5',
  },
  {
    icon: '⚖️',
    title: 'The Bean Line',
    sub: 'Judge Roy Bean',
    desc: 'Tom Wall of Sonora (Sutton County) is geographically adjacent to Roy Bean\'s territory in Langtry (Val Verde County). The Wall/Bean connection runs through the maternal line via Marie Wall → Dorothy May Hollmig.',
    color: '#EF9F27',
    bg: 'rgba(239,159,39,0.06)',
    border: 'rgba(239,159,39,0.25)',
    status: 'Active Research',
    statusColor: 'rgba(239,159,39,0.15)',
    statusText: '#fac775',
  },
  {
    icon: '📜',
    title: 'The Castleberry Line',
    sub: 'James Blandford Castleberry',
    desc: 'James Blandford Castleberry (b. Nov 11, 1852 – d. Apr 10, 1910) and Della Jane Hope head this confirmed line. Commander\'s father confirmed his grandmother was a Castleberry — connecting through Uma Verda Parker\'s mother Glenny Larcena.',
    color: '#3B8BD4',
    bg: 'rgba(59,139,212,0.06)',
    border: 'rgba(59,139,212,0.25)',
    status: 'Document Confirmed',
    statusColor: 'rgba(59,139,212,0.15)',
    statusText: '#7ab8f5',
  },
];

const TIMELINE = [
  { year: 'NOV 11, 1852', text: 'James Blandford Castleberry born — earliest confirmed ancestor' },
  { year: 'DEC 24, 1861', text: 'Oliver Lofton Sellers born — Bandera, TX' },
  { year: 'MAY 6, 1863', text: 'Glenny Larcena Castleberry born — key link to Parker bloodline' },
  { year: 'AUG 31, 1870', text: 'IDella Ann Custer born — Custer bloodline anchor' },
  { year: 'DEC 23, 1886', text: 'Oliver Lofton Sellers + IDella Ann Custer married · Bandera, Texas' },
  { year: 'APR 10, 1910', text: 'James Blandford Castleberry dies at age 57' },
  { year: 'MAY 7, 1891', text: 'Harvey Otis McWilliams born' },
  { year: 'NOV 21, 1892', text: 'Uma Verda Parker born — carries the Parker bloodline' },
  { year: 'NOV 22, 1912', text: 'Harvey Otis McWilliams + Uma Verda Parker married' },
  { year: 'MAY 24, 1915', text: 'Charles Windel McWilliams born · Kitchins, Menard County, TX' },
  { year: 'MAR 7, 1918', text: 'Hazel Floriene Sellers born · Saline, Menard County, TX' },
  { year: 'AUG 29, 1929', text: 'Uma Verda Parker dies at 36 — Charles Windel was only 14' },
  { year: 'JAN 4, 1943', text: 'Glenny Larcena Castleberry dies at age 79' },
  { year: 'OCT 19, 1946', text: 'Charles Windel McWilliams + Hazel Floriene Sellers married · Junction, TX' },
  { year: 'MAY 14, 1976', text: 'Bobby Don McWilliams II born — Commander, ECHO OMEGA PRIME' },
  { year: 'MAR 15, 1982', text: 'Charles Windel McWilliams dies · VA Hospital, San Antonio TX · Buried: Hex Cemetery' },
];

type AncestorCard = {
  id: string;
  gen: string;
  name: string;
  dates?: string;
  place?: string;
  badge: string;
  badgeColor: string;
  badgeBg: string;
  borderColor: string;
  bgColor: string;
  nameColor: string;
  glowColor: string;
  notes: string;
  rows?: [string, string, string][];
};

const ANCESTORS: AncestorCard[] = [
  { id: 'jbc', gen: 'Gen V · GGG-Grandfather', name: 'James Blandford Castleberry', dates: 'b. Nov 11, 1852 · d. Apr 10, 1910', badge: 'Confirmed', badgeColor: '#7ab8f5', badgeBg: 'rgba(59,139,212,0.2)', borderColor: 'rgba(59,139,212,0.28)', bgColor: 'rgba(59,139,212,0.055)', nameColor: '#b5d4f4', glowColor: 'rgba(59,139,212,0.3)', notes: 'Listed at the top of the Family Register document. Commander\'s father confirmed his grandmother was a Castleberry — connecting through Uma Verda Parker\'s maternal line.', rows: [['📅','Born','November 11, 1852'],['📅','Died','April 10, 1910'],['👤','Spouse','Della Jane Hope']] },
  { id: 'djh', gen: 'Gen V · GGG-Grandmother', name: 'Della Jane Hope', dates: 'Castleberry (by marriage)', badge: 'Document Header', badgeColor: '#7ab8f5', badgeBg: 'rgba(59,139,212,0.2)', borderColor: 'rgba(59,139,212,0.28)', bgColor: 'rgba(59,139,212,0.055)', nameColor: '#b5d4f4', glowColor: 'rgba(59,139,212,0.3)', notes: 'Listed in Family Register header alongside James Blandford Castleberry. Maiden name Hope — married into Castleberry family.', rows: [['👤','Spouse','James Blandford Castleberry']] },
  { id: 'glc', gen: 'Gen V · Parker Gateway', name: 'Glenny Larcena Castleberry', dates: 'b. May 6, 1863 · d. Jan 4, 1943', place: 'Married → ??? Parker', badge: 'Parker Link ◆', badgeColor: '#c77dff', badgeBg: 'rgba(158,68,204,0.2)', borderColor: 'rgba(158,68,204,0.38)', bgColor: 'rgba(158,68,204,0.07)', nameColor: '#d4aaff', glowColor: 'rgba(158,68,204,0.4)', notes: 'CRITICAL LINK. Glenny married a Parker man — their daughter was Uma Verda Parker. Identifying her husband\'s full name is the single most important open research task.', rows: [['📅','Born','May 6, 1863'],['📅','Died','January 4, 1943'],['👤','Husband','??? Parker — KEY RESEARCH'],['👶','Daughter','Uma Verda Parker (b.1892)']] },
  { id: 'custer_f', gen: 'Gen V · Custer Line', name: '??? Custer', dates: "IDella's father", place: 'Bandera, TX area', badge: 'Research Needed', badgeColor: '#fac775', badgeBg: 'rgba(239,159,39,0.2)', borderColor: 'rgba(255,255,255,0.06)', bgColor: 'rgba(255,255,255,0.02)', nameColor: '#fff', glowColor: 'transparent', notes: 'IDella Ann Custer\'s father. Geni.com "Custer Web Site" managed by Raylene Sellers has a partial family tree. Search Bandera County TX 1860–1880 census.', rows: [['📍','Location','Bandera, TX area'],['👶','Daughter','IDella Ann Custer (b.1870)']] },
  { id: 'harvey', gen: 'Gen IV · GG-Grandfather', name: 'Harvey Otis McWilliams', dates: 'b. May 7, 1891 · d. Dec 29, 1972', badge: 'Confirmed ✦', badgeColor: '#7ab8f5', badgeBg: 'rgba(59,139,212,0.2)', borderColor: 'rgba(59,139,212,0.28)', bgColor: 'rgba(59,139,212,0.055)', nameColor: '#b5d4f4', glowColor: 'rgba(59,139,212,0.3)', notes: 'CONFIRMED FROM FAMILY REGISTER. Your great-great-grandfather. Married Uma Verda Parker Nov 22, 1912. Father of Charles Windel McWilliams.', rows: [['📅','Born','May 7, 1891'],['📅','Died','December 29, 1972'],['💒','Married','Uma Verda Parker · Nov 22, 1912']] },
  { id: 'uma', gen: 'Gen IV · GG-Grandmother · PARKER', name: 'Uma Verda Parker', dates: 'b. Nov 21, 1892 · d. Aug 29, 1929', place: 'm. Nov 22, 1912', badge: 'Parker Bloodline ◆', badgeColor: '#c77dff', badgeBg: 'rgba(158,68,204,0.2)', borderColor: 'rgba(158,68,204,0.38)', bgColor: 'rgba(158,68,204,0.07)', nameColor: '#d4aaff', glowColor: 'rgba(158,68,204,0.5)', notes: 'CONFIRMED FROM FAMILY REGISTER. THE PARKER CONNECTION. Carries the Parker surname — her mother was Glenny Larcena Castleberry who married into the Parker family. Died at 36 when Charles Windel was only 14.', rows: [['📅','Born','November 21, 1892'],['📅','Died','August 29, 1929 (age 36)'],['👩','Mother','Glenny Larcena Castleberry']] },
  { id: 'oliver', gen: 'Gen IV · GG-Grandfather · SELLERS', name: 'Oliver Lofton Sellers', dates: 'b. Dec 24, 1861 · d. May 13, 1941', place: 'm. Dec 23, 1886 · Bandera TX', badge: 'Sellers Line ◆', badgeColor: '#7ecb7e', badgeBg: 'rgba(74,154,74,0.2)', borderColor: 'rgba(74,154,74,0.33)', bgColor: 'rgba(74,154,74,0.065)', nameColor: '#90ee90', glowColor: 'rgba(74,154,74,0.35)', notes: 'CONFIRMED FROM FAMILY REGISTER. Married IDella Ann Custer Dec 23, 1886 at Bandera, TX. Father of Hazel Floriene Sellers.', rows: [['📅','Born','December 24, 1861'],['📅','Died','May 13, 1941'],['💒','Married','IDella Ann Custer · Dec 23, 1886 · Bandera TX']] },
  { id: 'idella', gen: 'Gen IV · GG-Grandmother · CUSTER', name: 'IDella Ann Custer', dates: 'b. Aug 31, 1870 · d. May 10, 1959', place: 'Bandera, TX', badge: 'Custer Bloodline ◆', badgeColor: '#7ecb7e', badgeBg: 'rgba(74,154,74,0.2)', borderColor: 'rgba(74,154,74,0.33)', bgColor: 'rgba(74,154,74,0.065)', nameColor: '#90ee90', glowColor: 'rgba(74,154,74,0.4)', notes: 'CONFIRMED FROM FAMILY REGISTER. THE CUSTER CONNECTION. Maiden name Custer confirmed by primary document. Lived to 88. Geni.com "Custer Web Site" (Raylene Sellers) has records.', rows: [['📅','Born','August 31, 1870'],['📅','Died','May 10, 1959 (age 88)'],['💒','Married','Oliver Lofton Sellers · Dec 23, 1886 · Bandera TX']] },
  { id: 'tom_wall', gen: 'Gen IV · GG-Grandfather', name: 'Tom Wall', dates: 'Unknown', place: 'Sonora, Sutton Co TX', badge: 'Research Needed', badgeColor: '#fac775', badgeBg: 'rgba(239,159,39,0.2)', borderColor: 'rgba(239,159,39,0.23)', bgColor: 'rgba(239,159,39,0.045)', nameColor: '#fac775', glowColor: 'rgba(239,159,39,0.3)', notes: 'GG-grandfather on maternal side. Sutton County borders Val Verde County where Judge Roy Bean operated out of Langtry TX. Pull Sutton County 1880–1910 census for Wall households.', rows: [['📍','Location','Sonora, Sutton County, TX'],['👶','Daughter','Marie Wall']] },
  { id: 'charles', gen: 'Gen III · Great-Grandfather', name: 'Charles Windel McWilliams', dates: 'b. May 24, 1915 · d. Mar 15, 1982', place: 'Kitchins, Menard Co TX · Buried: Hex Cemetery', badge: 'Confirmed ✦', badgeColor: '#7ab8f5', badgeBg: 'rgba(59,139,212,0.2)', borderColor: 'rgba(158,68,204,0.38)', bgColor: 'rgba(158,68,204,0.07)', nameColor: '#d4aaff', glowColor: 'rgba(158,68,204,0.3)', notes: 'CONFIRMED FROM FAMILY REGISTER. Son of Harvey Otis McWilliams and Uma Verda Parker. Born Kitchins, Menard Co TX. Mother died when he was 14. Buried Hex Cemetery — headstone may name parents.', rows: [['📅','Born','May 24, 1915'],['📅','Died','March 15, 1982'],['📍','Buried','Hex Cemetery, Eastland County, TX'],['💒','Married','Hazel Floriene Sellers · Oct 19, 1946 · Junction TX']] },
  { id: 'hazel', gen: 'Gen III · Great-Grandmother · SELLERS', name: 'Hazel Floriene Sellers', dates: 'b. Mar 7, 1918 · d. Apr 12, 1972', place: 'Saline, Menard Co TX · Buried: Hex Cemetery', badge: 'Confirmed ✦', badgeColor: '#7ecb7e', badgeBg: 'rgba(74,154,74,0.2)', borderColor: 'rgba(74,154,74,0.33)', bgColor: 'rgba(74,154,74,0.065)', nameColor: '#90ee90', glowColor: 'rgba(74,154,74,0.35)', notes: 'CONFIRMED FROM FAMILY REGISTER. Maiden name SELLERS — carries the Custer bloodline through her mother IDella Ann Custer. Born Saline, Menard Co TX. Buried Hex Cemetery alongside Charles Windel.', rows: [['📅','Born','March 7, 1918'],['📅','Died','April 12, 1972'],['👨','Father','Oliver Lofton Sellers'],['👩','Mother','IDella Ann Custer']] },
  { id: 'ld', gen: 'Gen III · Grandfather (maternal)', name: 'L.D. Hollmig', dates: 'Unknown', place: 'Sonora, TX', badge: 'Confirmed', badgeColor: '#7ab8f5', badgeBg: 'rgba(59,139,212,0.2)', borderColor: 'rgba(59,139,212,0.28)', bgColor: 'rgba(59,139,212,0.055)', nameColor: '#b5d4f4', glowColor: 'rgba(59,139,212,0.3)', notes: 'Married Marie Wall of Sonora TX. Hollmig is German-origin — Hill Country settlement corridor (Fredericksburg-Mason-Sonora). San Antonio Light shows multiple Hollmig hits 1902–1937.', rows: [['📍','Location','Sonora, TX'],['👤','Wife','Marie Wall']] },
  { id: 'marie', gen: 'Gen III · Grandmother (maternal)', name: 'Marie Wall', dates: 'Unknown', place: 'Sonora, Sutton Co TX', badge: 'Wall Line', badgeColor: '#fac775', badgeBg: 'rgba(239,159,39,0.2)', borderColor: 'rgba(239,159,39,0.23)', bgColor: 'rgba(239,159,39,0.045)', nameColor: '#fac775', glowColor: 'rgba(239,159,39,0.3)', notes: 'Daughter of Tom Wall of Sonora TX. Wall ancestry is the thread toward Roy Bean\'s territory in Val Verde County. Married L.D. Hollmig.', rows: [['📍','Location','Sonora, Sutton Co TX'],['👨','Father','Tom Wall']] },
  { id: 'you', gen: 'Commander · ECHO OMEGA PRIME', name: 'Bobby Don McWilliams II', dates: 'b. May 14, 1976 · Midland, TX 79705', place: 'Parker · Custer · McWilliams · Sellers · Wall · Hollmig · Castleberry', badge: 'Commander', badgeColor: '#f0d080', badgeBg: 'rgba(201,168,76,0.2)', borderColor: 'rgba(201,168,76,0.48)', bgColor: 'rgba(201,168,76,0.075)', nameColor: '#f0d080', glowColor: 'rgba(201,168,76,0.55)', notes: 'Commander. Seven confirmed bloodlines:\n\n◆ PARKER — Uma Verda Parker → Glenny Castleberry → ??? Parker\n◆ CUSTER — IDella Ann Custer → Oliver Sellers → Hazel → Charles Windel\n◆ McWILLIAMS — Harvey Otis → Charles Windel → Bobbie Don Sr\n◆ SELLERS — Oliver Lofton → Hazel → Charles Windel\n◆ CASTLEBERRY — James Blandford → Glenny → Uma Parker\n◆ WALL — Tom Wall → Marie → Dorothy\n◆ HOLLMIG — L.D. Hollmig → Dorothy', rows: [['📅','Born','May 14, 1976'],['📍','Location','Midland, TX 79705'],['⚡','System','ECHO OMEGA PRIME']] },
];

export default function FamilyTreePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dnaRef = useRef<HTMLCanvasElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Starfield
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animId: number;
    const stars: {x:number;y:number;r:number;op:number;tw:number;ts:number;col:string}[] = [];
    const init = () => {
      canvas.width = window.innerWidth; canvas.height = window.innerHeight;
      stars.length = 0;
      for (let i = 0; i < 280; i++) {
        const t = Math.random();
        stars.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, r: Math.random()*1.4+0.2, op: Math.random()*0.5+0.1, tw: Math.random()*Math.PI*2, ts: Math.random()*0.018+0.004, col: t>0.7?`hsl(${200+t*60},75%,88%)`:'#fff' });
      }
    };
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      stars.forEach(s => { s.tw+=s.ts; const o=s.op*(0.6+0.4*Math.sin(s.tw)); ctx.save(); ctx.globalAlpha=o; ctx.fillStyle=s.col; ctx.shadowBlur=s.r*2.5; ctx.shadowColor=s.col; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill(); ctx.restore(); });
      animId = requestAnimationFrame(draw);
    };
    init(); draw();
    window.addEventListener('resize', init);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', init); };
  }, []);

  // DNA particles
  useEffect(() => {
    const canvas = dnaRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animId: number;
    const cols = ['#9e44cc','#3B8BD4','#4a9a4a','#c9a84c'];
    const pts: {x:number;y:number;vx:number;vy:number;r:number;col:string;op:number}[] = [];
    const init = () => {
      canvas.width = window.innerWidth; canvas.height = window.innerHeight;
      pts.length = 0;
      for (let i=0;i<70;i++) pts.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,vx:(Math.random()-0.5)*0.25,vy:(Math.random()-0.5)*0.25,r:Math.random()*1.8+0.4,col:cols[Math.floor(Math.random()*4)],op:Math.random()*0.35+0.1});
    };
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);if(d<110){ctx.save();ctx.globalAlpha=(1-d/110)*0.1;ctx.strokeStyle=pts[i].col;ctx.lineWidth=0.5;ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.stroke();ctx.restore();}}
      pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=canvas.width;if(p.x>canvas.width)p.x=0;if(p.y<0)p.y=canvas.height;if(p.y>canvas.height)p.y=0;ctx.save();ctx.globalAlpha=p.op;ctx.fillStyle=p.col;ctx.shadowBlur=5;ctx.shadowColor=p.col;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();ctx.restore();});
      animId = requestAnimationFrame(draw);
    };
    init(); draw();
    window.addEventListener('resize', init);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', init); };
  }, []);

  const showDetail = (id: string) => {
    const a = ANCESTORS.find(x=>x.id===id);
    if (!a || !panelRef.current) return;
    const panel = panelRef.current;
    panel.querySelector('#dp-eye')!.textContent = a.gen;
    panel.querySelector('#dp-name')!.textContent = a.name;
    const body = panel.querySelector('#dp-body')!;
    let h = '';
    (a.rows||[]).forEach(([ic,lb,vl])=>{h+=`<div style="display:flex;gap:10px;margin-bottom:8px;align-items:flex-start"><span style="font-size:14px">${ic}</span><span style="font-size:12px;color:rgba(232,234,240,0.55);line-height:1.5"><strong style="color:#e8eaf0;font-weight:500">${lb}:</strong> ${vl}</span></div>`;});
    h+=`<hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);margin:14px 0"/><div style="font-size:12px;line-height:1.72;color:rgba(232,234,240,0.55);background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:14px;white-space:pre-line">${a.notes}</div>`;
    body.innerHTML = h;
    panel.style.transform = 'translateX(0)';
  };
  const closePanel = () => { if(panelRef.current) panelRef.current.style.transform='translateX(100%)'; };

  return (
    <div style={{background:'#0a0e17',minHeight:'100vh',color:'#e8eaf0',fontFamily:'Inter,sans-serif',overflowX:'hidden'}}>
      {/* Backgrounds */}
      <canvas ref={canvasRef} style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',zIndex:0,pointerEvents:'none'}}/>
      <canvas ref={dnaRef} style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',zIndex:0,pointerEvents:'none',opacity:0.12}}/>

      {/* Nav */}
      <nav style={{position:'fixed',top:0,width:'100%',zIndex:100,background:'rgba(10,14,23,0.88)',backdropFilter:'blur(24px)',borderBottom:'1px solid rgba(255,255,255,0.07)',height:72,display:'flex',alignItems:'center',padding:'0 2rem',justifyContent:'space-between'}}>
        <Link href="/" style={{fontFamily:'Cinzel,serif',fontSize:'1.05rem',letterSpacing:'0.18em',color:'#c9a84c',fontWeight:600,textDecoration:'none'}}>⬡ ECHO PRIME</Link>
        <div style={{display:'flex',gap:'2rem',alignItems:'center'}}>
          {NAV_ITEMS.map(n=><Link key={n.href} href={n.href} style={{color:'rgba(232,234,240,0.55)',fontSize:'0.85rem',textDecoration:'none',fontWeight:500}}>{n.label}</Link>)}
          <span style={{color:'#c9a84c',fontSize:'0.85rem',fontWeight:500}}>Family Archive</span>
        </div>
      </nav>

      {/* Hero */}
      <div style={{position:'relative',zIndex:1,padding:'140px 2rem 50px',textAlign:'center'}}>
        <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:'0.68rem',letterSpacing:'0.3em',color:'#c9a84c',textTransform:'uppercase',marginBottom:'1.5rem',opacity:0.75}}>ECHO OMEGA PRIME · Commander Bobby Don McWilliams II · Genealogy Registry</div>
        <h1 style={{fontFamily:'Cinzel,serif',fontSize:'clamp(2rem,5vw,3.8rem)',fontWeight:700,letterSpacing:'0.06em',background:'linear-gradient(135deg,#fff 0%,#f0d080 50%,#c9a84c 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',lineHeight:1.15,marginBottom:'1rem'}}>The McWilliams<br/>Bloodline Archive</h1>
        <p style={{color:'rgba(232,234,240,0.55)',fontSize:'0.95rem',maxWidth:580,margin:'0 auto 2rem',lineHeight:1.75,fontWeight:300}}>Seven confirmed generations tracing the Parker, Custer, Castleberry, Sellers, Wall, and Hollmig bloodlines across the Texas frontier — from Menard County to Midland.</p>
        <div style={{display:'flex',flexWrap:'wrap',gap:'0.7rem',justifyContent:'center',marginBottom:'2.5rem'}}>
          {[['✓ Primary Source Confirmed','rgba(59,139,212,0.15)','#7ab8f5','rgba(59,139,212,0.3)'],['◆ Parker / Quanah Line','rgba(158,68,204,0.15)','#c77dff','rgba(158,68,204,0.3)'],['◆ Custer / IDella Line','rgba(74,154,74,0.15)','#7ecb7e','rgba(74,154,74,0.3)'],['◆ Roy Bean / Wall Line','rgba(239,159,39,0.15)','#fac775','rgba(239,159,39,0.3)']].map(([l,bg,c,bd])=>(
            <span key={l as string} style={{fontFamily:'JetBrains Mono,monospace',fontSize:'0.65rem',padding:'0.3rem 0.75rem',borderRadius:4,letterSpacing:'0.1em',background:bg as string,color:c as string,border:`1px solid ${bd as string}`}}>{l as string}</span>
          ))}
        </div>
        <div style={{width:60,height:1,background:'linear-gradient(90deg,transparent,#c9a84c,transparent)',margin:'0 auto'}}/>
      </div>

      {/* Legend */}
      <div style={{display:'flex',flexWrap:'wrap',gap:'1.5rem',justifyContent:'center',padding:'0.9rem 2rem',background:'rgba(255,255,255,0.018)',borderTop:'1px solid rgba(255,255,255,0.07)',borderBottom:'1px solid rgba(255,255,255,0.07)',marginBottom:'2.5rem',position:'relative',zIndex:1}}>
        {[['#3B8BD4','Confirmed — Primary Document'],['#9e44cc','Parker Bloodline'],['#4a9a4a','Custer / Sellers Bloodline'],['#EF9F27','Needs Research'],['#c9a84c','Commander'],['#333','Unknown']].map(([c,l])=>(
          <div key={l as string} style={{display:'flex',alignItems:'center',gap:'0.45rem',fontSize:'0.72rem',color:'rgba(232,234,240,0.55)'}}>
            <div style={{width:10,height:10,borderRadius:2,background:c as string,flexShrink:0}}/>
            {l as string}
          </div>
        ))}
      </div>

      {/* Section header */}
      <div style={{textAlign:'center',padding:'0 2rem 1.2rem',position:'relative',zIndex:1}}>
        <h2 style={{fontFamily:'Cinzel,serif',fontSize:'clamp(1.1rem,3vw,1.7rem)',fontWeight:600,letterSpacing:'0.09em',background:'linear-gradient(90deg,#f0d080,#c9a84c)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Family Registry</h2>
        <p style={{fontSize:'0.82rem',color:'rgba(232,234,240,0.3)',marginTop:'0.4rem',fontStyle:'italic'}}>Click any ancestor to view full biographical record</p>
      </div>

      {/* Tree */}
      <div style={{position:'relative',zIndex:1,padding:'0 0.5rem 2rem',maxWidth:1500,margin:'0 auto'}}>

        {/* GEN 5 */}
        <div style={{display:'flex',gap:'0.8rem',justifyContent:'center',flexWrap:'wrap',padding:'0.8rem 0.5rem'}}>
          {ANCESTORS.filter(a=>['jbc','djh','glc','custer_f'].includes(a.id)).map(a=><ACard key={a.id} a={a} onClick={()=>showDetail(a.id)}/>)}
        </div>
        <Connector/>

        {/* GEN 4 */}
        <div style={{display:'flex',gap:'0.8rem',justifyContent:'center',flexWrap:'wrap',padding:'0.8rem 0.5rem'}}>
          {ANCESTORS.filter(a=>['harvey','uma','oliver','idella','tom_wall'].includes(a.id)).map(a=><ACard key={a.id} a={a} onClick={()=>showDetail(a.id)}/>)}
        </div>
        <Connector/>

        {/* GEN 3 */}
        <div style={{display:'flex',gap:'0.8rem',justifyContent:'center',flexWrap:'wrap',padding:'0.8rem 0.5rem'}}>
          {ANCESTORS.filter(a=>['charles','hazel','ld','marie'].includes(a.id)).map(a=><ACard key={a.id} a={a} onClick={()=>showDetail(a.id)}/>)}
        </div>
        <Connector label="married Oct 19, 1946 · Junction TX"/>

        {/* GEN 2 — Grandparents simplified */}
        <div style={{display:'flex',gap:'0.8rem',justifyContent:'center',flexWrap:'wrap',padding:'0.8rem 0.5rem'}}>
          {[{id:'gps',gen:'Gen II · Grandfather (paternal)',name:'Bobbie Don McWilliams',dates:'Unknown',place:'Hex / Eastland Co, TX',badge:'Confirmed',badgeColor:'#7ab8f5',badgeBg:'rgba(59,139,212,0.2)',borderColor:'rgba(59,139,212,0.28)',bgColor:'rgba(59,139,212,0.055)',nameColor:'#b5d4f4',glowColor:'rgba(59,139,212,0.3)',notes:'Your paternal grandfather. Son of Charles Windel McWilliams and Hazel Floriene Sellers. Carries both the Parker and Custer bloodlines.'},
           {id:'ld2',gen:'Gen II · Grandfather (maternal)',name:'L.D. Hollmig',dates:'Unknown',place:'Sonora, TX',badge:'Confirmed',badgeColor:'#7ab8f5',badgeBg:'rgba(59,139,212,0.2)',borderColor:'rgba(59,139,212,0.28)',bgColor:'rgba(59,139,212,0.055)',nameColor:'#b5d4f4',glowColor:'rgba(59,139,212,0.3)',notes:'Your maternal grandfather. Married Marie Wall.'},
           {id:'marie2',gen:'Gen II · Grandmother (maternal)',name:'Marie Wall',dates:'Unknown',place:'Sonora, TX',badge:'Wall Line',badgeColor:'#fac775',badgeBg:'rgba(239,159,39,0.2)',borderColor:'rgba(239,159,39,0.23)',bgColor:'rgba(239,159,39,0.045)',nameColor:'#fac775',glowColor:'rgba(239,159,39,0.3)',notes:'Daughter of Tom Wall. Wall/Bean research thread.'}
          ].map((a:any)=><ACard key={a.id} a={a} onClick={()=>showDetail(a.id)}/>)}
        </div>
        <Connector/>

        {/* GEN 1 — Parents */}
        <div style={{display:'flex',gap:'0.8rem',justifyContent:'center',flexWrap:'wrap',padding:'0.8rem 0.5rem'}}>
          {[{id:'dad',gen:'Gen I · Father',name:'Bobbie Don McWilliams',dates:'Unknown',place:'Midland, TX',badge:'Confirmed',badgeColor:'#7ab8f5',badgeBg:'rgba(59,139,212,0.2)',borderColor:'rgba(59,139,212,0.28)',bgColor:'rgba(59,139,212,0.055)',nameColor:'#b5d4f4',glowColor:'rgba(59,139,212,0.3)',notes:'Your father. Confirmed his grandmother was a Castleberry.'},
           {id:'mom',gen:'Gen I · Mother',name:'Dorothy May Hollmig',dates:'Unknown',place:'Sonora, TX area',badge:'Confirmed',badgeColor:'#7ab8f5',badgeBg:'rgba(59,139,212,0.2)',borderColor:'rgba(59,139,212,0.28)',bgColor:'rgba(59,139,212,0.055)',nameColor:'#b5d4f4',glowColor:'rgba(59,139,212,0.3)',notes:'Your mother. Daughter of L.D. Hollmig and Marie Wall.'}
          ].map((a:any)=><ACard key={a.id} a={a} onClick={()=>showDetail(a.id)}/>)}
        </div>
        <Connector label="married"/>

        {/* YOU */}
        <div style={{display:'flex',justifyContent:'center',padding:'0.8rem 0.5rem'}}>
          <ACard a={ANCESTORS.find(x=>x.id==='you')!} onClick={()=>showDetail('you')} isYou/>
        </div>
      </div>

      {/* Bloodlines */}
      <div style={{textAlign:'center',padding:'2rem 2rem 1.2rem',position:'relative',zIndex:1}}>
        <h2 style={{fontFamily:'Cinzel,serif',fontSize:'clamp(1.1rem,3vw,1.7rem)',fontWeight:600,letterSpacing:'0.09em',background:'linear-gradient(90deg,#f0d080,#c9a84c)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Bloodline Research Threads</h2>
      </div>
      <div style={{position:'relative',zIndex:1,display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(270px,1fr))',gap:'1.3rem',padding:'0 1.5rem 2.5rem',maxWidth:1200,margin:'0 auto'}}>
        {BLOODLINES.map(b=>(
          <div key={b.title} style={{background:b.bg,border:`1px solid ${b.border}`,borderRadius:14,padding:'1.4rem'}}>
            <div style={{fontSize:'1.8rem',marginBottom:'0.65rem'}}>{b.icon}</div>
            <div style={{fontFamily:'Cinzel,serif',fontSize:'0.95rem',fontWeight:700,color:b.color,marginBottom:'0.2rem'}}>{b.title}</div>
            <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:'0.6rem',color:b.color,opacity:0.7,marginBottom:'0.45rem',letterSpacing:'0.1em'}}>{b.sub}</div>
            <div style={{fontSize:'0.77rem',color:'rgba(232,234,240,0.55)',lineHeight:1.6}}>{b.desc}</div>
            <span style={{display:'inline-block',marginTop:'0.65rem',fontFamily:'JetBrains Mono,monospace',fontSize:'0.58rem',padding:'0.22rem 0.55rem',borderRadius:3,textTransform:'uppercase',letterSpacing:'0.08em',background:b.statusColor,color:b.statusText}}>{b.status}</span>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div style={{textAlign:'center',padding:'1rem 2rem 1.2rem',position:'relative',zIndex:1}}>
        <h2 style={{fontFamily:'Cinzel,serif',fontSize:'clamp(1.1rem,3vw,1.7rem)',fontWeight:600,letterSpacing:'0.09em',background:'linear-gradient(90deg,#f0d080,#c9a84c)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Family Timeline</h2>
        <p style={{fontSize:'0.82rem',color:'rgba(232,234,240,0.3)',marginTop:'0.4rem',fontStyle:'italic'}}>Confirmed dates from primary source document</p>
      </div>
      <div style={{position:'relative',zIndex:1,padding:'0 2rem 3rem',maxWidth:900,margin:'0 auto'}}>
        <div style={{position:'relative',paddingLeft:'1.8rem'}}>
          <div style={{position:'absolute',left:'0.4rem',top:0,bottom:0,width:1,background:'linear-gradient(to bottom,transparent,rgba(201,168,76,0.3) 8%,rgba(201,168,76,0.3) 92%,transparent)'}}/>
          {TIMELINE.map((t,i)=>(
            <div key={i} style={{position:'relative',marginBottom:'1.4rem',paddingLeft:'1.3rem'}}>
              <div style={{position:'absolute',left:'-0.2rem',top:'0.38rem',width:8,height:8,borderRadius:'50%',border:'1px solid #c9a84c',background:'#0a0e17'}}/>
              <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:'0.62rem',color:'#c9a84c',letterSpacing:'0.14em',marginBottom:'0.22rem'}}>{t.year}</div>
              <div style={{fontSize:'0.8rem',color:'rgba(232,234,240,0.55)',lineHeight:1.5}} dangerouslySetInnerHTML={{__html:t.text.replace(/\*\*(.+?)\*\*/g,'<strong style="color:#e8eaf0">$1</strong>')}}/>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{position:'relative',zIndex:1,textAlign:'center',padding:'2.5rem 2rem',borderTop:'1px solid rgba(255,255,255,0.07)',fontFamily:'JetBrains Mono,monospace',fontSize:'0.62rem',color:'rgba(232,234,240,0.3)',letterSpacing:'0.08em',lineHeight:1.9}}>
        <div>ECHO PRIME TECHNOLOGIES · MCWILLIAMS FAMILY ARCHIVE · COMMANDER LEVEL ACCESS</div>
        <div>Primary source: Family Register (handwritten document) · Supplemental: FamilySearch · FindAGrave · Chronicling America · LOC</div>
      </footer>

      {/* Detail Panel */}
      <div ref={panelRef} style={{position:'fixed',right:0,top:72,bottom:0,width:350,background:'rgba(7,10,16,0.97)',borderLeft:'1px solid rgba(255,255,255,0.07)',backdropFilter:'blur(28px)',padding:'1.8rem 1.4rem',overflowY:'auto',zIndex:500,transform:'translateX(100%)',transition:'transform 0.4s cubic-bezier(0.23,1,0.32,1)'}}>
        <button onClick={closePanel} style={{position:'absolute',top:'0.9rem',right:'0.9rem',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:6,color:'rgba(232,234,240,0.55)',width:30,height:30,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.9rem'}}>✕</button>
        <div id="dp-eye" style={{fontFamily:'JetBrains Mono,monospace',fontSize:'0.58rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'#c9a84c',marginBottom:'0.7rem'}}/>
        <div id="dp-name" style={{fontFamily:'Cinzel,serif',fontSize:'1.3rem',fontWeight:700,lineHeight:1.2,marginBottom:'0.9rem',color:'#fff'}}/>
        <div id="dp-body"/>
      </div>
    </div>
  );
}

function ACard({ a, onClick, isYou }: { a: AncestorCard; onClick: ()=>void; isYou?: boolean }) {
  return (
    <div onClick={onClick} style={{background:a.bgColor,border:`1px solid ${a.borderColor}`,borderRadius:11,padding:isYou?'1rem 1.3rem':'0.9rem 1.1rem',minWidth:isYou?280:155,maxWidth:isYou?320:195,cursor:'pointer',position:'relative',backdropFilter:'blur(10px)',flexShrink:0,transition:'all 0.3s cubic-bezier(0.23,1,0.32,1)',textAlign:isYou?'center':'left'}}
      onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-4px) scale(1.025)';(e.currentTarget as HTMLElement).style.boxShadow=`0 18px 50px rgba(0,0,0,0.5),0 0 28px ${a.glowColor}`;}}
      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='';(e.currentTarget as HTMLElement).style.boxShadow='';}}
    >
      <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:'0.56rem',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'0.3rem',opacity:0.45,color:isYou?a.nameColor:'#e8eaf0'}}>{a.gen}</div>
      <div style={{fontFamily:'Cinzel,serif',fontSize:isYou?'1rem':'0.82rem',fontWeight:600,lineHeight:1.3,marginBottom:'0.35rem',color:a.nameColor}}>{a.name}</div>
      {a.dates&&<div style={{fontFamily:'JetBrains Mono,monospace',fontSize:'0.58rem',color:'rgba(232,234,240,0.3)',lineHeight:1.55}}>{a.dates}</div>}
      {a.place&&<div style={{fontSize:'0.62rem',color:'rgba(232,234,240,0.3)',marginTop:'0.22rem',fontStyle:'italic'}}>{a.place}</div>}
      <span style={{display:'inline-block',fontSize:'0.52rem',fontFamily:'JetBrains Mono,monospace',padding:'0.13rem 0.38rem',borderRadius:3,marginTop:'0.38rem',letterSpacing:'0.07em',textTransform:'uppercase',background:a.badgeBg,color:a.badgeColor}}>{a.badge}</span>
    </div>
  );
}

function Connector({ label }: { label?: string }) {
  return (
    <div style={{display:'flex',justifyContent:'center',padding:'0.1rem 0',position:'relative'}}>
      <div style={{width:1,height:28,background:'linear-gradient(to bottom,rgba(201,168,76,0.25),rgba(201,168,76,0.1))',position:'relative'}}>
        {label&&<span style={{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)',whiteSpace:'nowrap',fontFamily:'JetBrains Mono,monospace',fontSize:'0.58rem',color:'rgba(201,168,76,0.35)',background:'#0a0e17',padding:'0 6px'}}>{label}</span>}
      </div>
    </div>
  );
}
