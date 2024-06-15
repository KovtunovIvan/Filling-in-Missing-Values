import { useEffect, useState, useRef } from "react";
import { Outlet, ScrollRestoration, NavLink, } from "react-router-dom";
import { useClickOutside } from "../../hooks/useClickOutside";


export const articlesList = [
    {
        id: 0,
        navItem: "Обзор",
        title:"Обзор",
        content: [
                    {
                        subtitle: "",
                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ornare aenean euismod elementum nisi quis. Sit amet nulla facilisi morbi tempus iaculis urna id. Nisl suscipit adipiscing bibendum est ultricies. Consequat semper viverra nam libero justo laoreet sit amet. Amet nisl purus in mollis nunc sed id semper risus. Dolor purus non enim praesent elementum facilisis leo. Eget mi proin sed libero enim sed faucibus turpis in. Iaculis eu non diam phasellus vestibulum lorem sed risus. Nunc id cursus metus aliquam eleifend mi in. In nisl nisi scelerisque eu ultrices vitae auctor. Non curabitur gravida arcu ac tortor dignissim convallis aenean et. Sed risus pretium quam vulputate dignissim suspendisse."
                    }
        ],
        ref: [
            "— Пример отображения ссылки на сторонний ресурс или название литературного источника",
            "— Пример отображения ссылки на сторонний ресурс или название литературного источника",
        ],
        children: [],

    },
    {
        id: 1,
        navItem: "Предобработка",
        title:"Предобработка",
        content: [
                    {
                        subtitle: "",
                        text: "Elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices gravida dictum fusce ut placerat orci. Vulputate odio ut enim blandit volutpat. Rutrum quisque non tellus orci. Condimentum mattis pellentesque id nibh tortor id aliquet lectus proin. Id eu nisl nunc mi ipsum. Enim nunc faucibus a pellentesque sit. Vitae suscipit tellus mauris a diam. Pellentesque diam volutpat commodo sed. Scelerisque varius morbi enim nunc faucibus a pellentesque. Vitae congue eu consequat ac felis."
                    }
        ],
        ref: [
            "— Пример отображения ссылки на сторонний ресурс или название литературного источника",
            "— Пример отображения ссылки на сторонний ресурс или название литературного источника",
        ],
        children: [
            {
                id: 2,
                navItem: "Метод 1",
                title:"Метод 1",
                content: [
                            {
                                subtitle: "",
                                text: "Adipiscing enim eu turpis egestas pretium aenean pharetra magna. Nisi scelerisque eu ultrices vitae auctor. Id semper risus in hendrerit gravida rutrum quisque non. Ut aliquam purus sit amet luctus. Volutpat maecenas volutpat blandit aliquam. Tincidunt praesent semper feugiat nibh sed pulvinar proin gravida. Turpis egestas integer eget aliquet. Proin sagittis nisl rhoncus mattis rhoncus urna neque viverra justo. Sit amet nisl purus in. Mollis aliquam ut porttitor leo a diam sollicitudin tempor id. Justo donec enim diam vulputate. Massa tincidunt dui ut ornare lectus."
                            }
                ],
                ref: [
                    "— Пример отображения ссылки на сторонний ресурс или название литературного источника",
                    "— Пример отображения ссылки на сторонний ресурс или название литературного источника",
                ],
            },
            {
                id: 3,
                navItem: "Метод 2",
                title:"Метод 2",
                content: [
                            {
                                subtitle: "",
                                text: "Velit laoreet id donec ultrices tincidunt. Donec adipiscing tristique risus nec feugiat in fermentum posuere. Sit amet nisl purus in. Elementum integer enim neque volutpat. Lectus mauris ultrices eros in. Amet nisl suscipit adipiscing bibendum est. Faucibus ornare suspendisse sed nisi. Elementum facilisis leo vel fringilla est ullamcorper eget nulla. Nisi vitae suscipit tellus mauris a. Erat pellentesque adipiscing commodo elit at imperdiet dui accumsan sit. Suspendisse in est ante in nibh mauris cursus mattis molestie. Sapien pellentesque habitant morbi tristique senectus et. Tempus urna et pharetra pharetra massa massa ultricies. Id faucibus nisl tincidunt eget nullam non nisi est. Sit amet nulla facilisi morbi tempus iaculis. Non enim praesent elementum facilisis leo vel fringilla. Sit amet tellus cras adipiscing enim eu turpis egestas pretium. Pellentesque dignissim enim sit amet. Ut etiam sit amet nisl."
                            }
                ],
                ref: [
                    "— Пример отображения ссылки на сторонний ресурс или название литературного источника",
                    "— Пример отображения ссылки на сторонний ресурс или название литературного источника",
                ],
            },
        ],

    },
    {
        id: 4,
        navItem: "Визуализация",
        title:"Визуализация",
        content: [
                    {
                        subtitle: "",
                        text: "Lorem ipsum dolor sit amet consectetur adipiscing elit duis. Feugiat sed lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi. Enim diam vulputate ut pharetra sit amet aliquam. Ipsum dolor sit amet consectetur adipiscing elit ut aliquam purus. Volutpat diam ut venenatis tellus. Sit amet aliquam id diam maecenas. Erat nam at lectus urna duis convallis convallis. Nisl pretium fusce id velit ut tortor. Morbi non arcu risus quis varius quam quisque id diam. Massa sapien faucibus et molestie ac feugiat sed lectus vestibulum. Tincidunt lobortis feugiat vivamus at augue eget arcu dictum varius. Vitae aliquet nec ullamcorper sit."
                    }
        ],
        ref: [
            "— Пример отображения ссылки на сторонний ресурс или название литературного источника",
            "— Пример отображения ссылки на сторонний ресурс или название литературного источника",
        ],
        children: [],

    },
]

export const giudeChildrenRoutes =  [
    {
        index:true,
        path:"/platform/guide/0",
        element:<GiudeContent article={articlesList[0]}/>,
      },
      {
        path:"/platform/guide/1",
        element:<GiudeContent article={articlesList[1]}/>,
      },
      {
        path:"/platform/guide/1/2",
        element:<GiudeContent article={articlesList[1].children[0]}/>,
      },
      {
        path:"/platform/guide/1/3",
        element:<GiudeContent article={articlesList[1].children[1]}/>,
      },
      {
        path:"/platform/guide/4",
        element:<GiudeContent article={articlesList[2]}/>,
      },
]

export function Guide() {
    return (
        <div className='guide-main-wrapper wrapper'>
            <GuideNavigation articles={articlesList}/>
            <div className='guide-content-container'>
                <Outlet />
            </div>
            <ScrollRestoration/> 
        </div>
    )
}

export function GiudeContent(props) {
    const {article} = props;
    const refList = article.ref.map((ref) => {
        return (
            <div className="guide-content__ref">
                {ref}
            </div>
        )
    }) 
    return (
        <div>
            <div className="guide-content__title">
                {article.title}
            </div>

            <div className="guide-content__text">
                {article.content[0].text}
            </div>
            <div className="guide-content__ref-title">
                Материалы
            </div>
            {refList}
        </div>
    )
}

function GuideNavigation(props) {
    const {articles} = props;
    const [isActiveMenu, setIsActiveMenu] = useState(false);

    function handleClickMenuButton() {
        setIsActiveMenu(prevState => !prevState)
    }

    function handleClickHideMenu() {
        setIsActiveMenu(false)
    }
    const [active, setActive] = useState(0);
    const navItems = articles.map((item) => {
        return (
            <Lable 
                main={item.navItem}  
                id={item.id} 
                children={item.children}
                hendleChangeActive={() => {setActive(item.id)}}
                handleHideMenu={ handleClickHideMenu }
                active={active}
            />
        )
    });

    const wrapRef = useRef(null);
    useClickOutside(wrapRef, handleClickHideMenu);

    return (
        <div className="guide-menu-wrapper" ref={wrapRef}>
            <div className={isActiveMenu ? "guide-nav-container guide-nav-container_active": "guide-nav-container"}>
                {navItems}
            </div>
            <div 
                className={isActiveMenu ? "guide-menu-button guide-menu-button_active" : "guide-menu-button" }
                onClick={handleClickMenuButton}
            >
                <span className="arrow arrow-right"/>
            </div>
        </div>
    )
}

function Lable(props) {
    const {main, id, children, hendleChangeActive, handleHideMenu, active} = props;

    const ischildren = children.length !== 0;
    const dropdowns = !ischildren ? null : children.map((child) => {
        return (
            <NavLink to={`/platform/guide/${id}/${child.id}`}
                className= {({isActive}) => 
                    isActive ? 
                    "guide-nav__child-link guide-nav__child-link_active" 
                    : "guide-nav__child-link"}
                    onClick={handleHideMenu}
                key={child.id}
            >
                {child.navItem}
            </NavLink>
        )
    }) 
    const [isOpen, setIsOpen] = useState(false);

    useEffect(()=> {
        if(id === 1){
            if(active === 1 || active === 2 || active === 3){
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        }
    }, [active])

    const henldeOpen = (e) => {
        setIsOpen(!isOpen)
        hendleChangeActive(id);
        handleHideMenu();
    }


    return (
        <div>
                <NavLink 
                    to={`/platform/guide/${id}`}
                    className= {({isActive}) => 
                        isActive ? 
                        "guide-nav__link  guide-nav__link_active" 
                        : "guide-nav__link"
                    }
                    onClick={henldeOpen}
                >
                    {main}
                    {
                        ischildren ? 
                        <div class="arrow-4">
                            <span 
                                class={isOpen ? "arrow-4-left_open arrow-4-left" : "arrow-4-left"}
                            />
                            <span 
                                class={isOpen ? "arrow-4-right_open arrow-4-right" : "arrow-4-right"}
                            />
                        </div>
                        : ""
                    }
                </NavLink>
                { isOpen &&
                    <div>
                        {dropdowns}
                    </div>}
        </div>

    )
}