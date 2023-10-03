import Image from 'next/image'


export default function Home() {
  return (
    <div className="main text-slate-950 bg-[url('../assets/bg.svg')] bg-auto w-full h-screen bg-contain">
     <div className="grid grid-cols-16 w-full h-screen">
      <div className="col-span-2 bg-bg-orange">
        .mdg
      </div>
      <div className="col-span-13 mx-[3vw] bg-transparent">
        <div className="grid grid-rows-12 h-screen">
          <div className="row-span-1 bg-slate-200">
            <div className="grid grid-cols-8  h-full">
              <div className="col-span-1 flex flex-col justify-end">
                Queries
              </div>
              <div className="col-span-1 flex flex-col justify-end">
                Templates
              </div>
              <div className="col-span-6 text-right flex flex-col justify-end">
                Join Slack
              </div>
            </div>
          </div>
          <div className="row-span-10 bg-slate-300">
            hmm
          </div>
          <div className="row bg-slate-400">
            hmm
          </div>
        </div>
      </div>
      <div className="div bg-bg-orange">
        
      </div>
     </div>
    </div>
  )
}
