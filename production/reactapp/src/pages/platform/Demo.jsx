import ReactPlayer from 'react-player/youtube'

export function Demo() {
    return (
        <>
        <div className='root__show-video__headline1'>
            Посмотрите на MedMinds в действии
        </div>
        <div className='root__show-video__headline2'>
            и оцените, подойдет ли вам наше решение
        </div>
        <div className='root__show-video__video'>
            <ReactPlayer controls={true} light={true} url='https://youtu.be/xNyBmQOhX9Q' />
        </div>
    </>
    )
}