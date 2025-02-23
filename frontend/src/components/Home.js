import Authentication from './Authentication';

function Home(){
    return(
        <div className='bg-myBackground min-h-screen p-6 flex flex-col items-center'>
            <h1 className='text-myOrange caret-transparent text-4xl font-bold mt-10'>Keep track of your job applications!</h1>
            <Authentication className='' />
        </div>
        
    )
}

export default Home;