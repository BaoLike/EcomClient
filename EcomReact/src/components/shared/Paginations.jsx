import { Pagination } from '@mui/material'
import { useLoaderData, useLocation, useNavigate, useSearchParams } from "react-router-dom";

const Paginations = ({numberOfPage, totalProducts})=>{
    const [searchParams] = useSearchParams();
    const {pathname} = useLocation();
    const params = new URLSearchParams();
    const navigate = useNavigate();
    const paramValue = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

    const onChangeHandle = (event, value)=>{
        params.set("page", value.toString());
        navigate(`${pathname}?${params}`);  
    }
    return (
        <div>
            <Pagination 
            count={numberOfPage} 
            page={paramValue}
            defaultPage={1} 
            siblingCount={0} 
            boundaryCount={2} 
            shape="rounded"
            onChange={onChangeHandle}/>
        </div>
    )
};

export default Paginations;