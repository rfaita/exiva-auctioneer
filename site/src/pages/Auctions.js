import React, { useEffect, useState, useCallback, useRef, Fragment } from 'react';
import AuctionGrid from '../components/AuctionGrid';
import AuctionDialog from '../components/AuctionDialog';
import { useLocation } from 'react-router-dom';
import useAuctionsSearch from '../hooks/useAuctionsSearch';
import parseQuery from '../helper/QueryParser';
import { getToken } from '../services/Firebase';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

export default function Auctions(props) {

    const [query, setQuery] = useState(props.query);
    const [sortType, setSortType] = useState();
    const [sortOrder, setSortOrder] = useState();
    const [page, setPage] = useState(0);
    const [reset, setReset] = useState(false);

    const queryParam = useQuery();

    let q = queryParam.get('q') || JSON.stringify(parseQuery('value 0'));
    let st = queryParam.get('st') || 'endDate';
    let so = queryParam.get('so') || 'asc';

    useEffect(() => {

        if (!!q) {
            setQuery(q);
        }
        if (!!st) {
            setSortType(st);
        }
        if (!!so) {
            setSortOrder(so);
        }
        setPage(0);

    }, [q, st, so])

    const {
        loading,
        auctions, hasMore
    } = useAuctionsSearch(query, page, sortType, sortOrder, reset);

    const observer = useRef();
    const lastElementRef = useCallback(node => {
        if (loading) {
            return;
        }
        if (observer.current) {
            observer.current.disconnect();
        }
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) {
            observer.current.observe(node);
        }
    }, [loading, hasMore]);

    const [auctionId, setAuctionId] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);

    const openDetailDialog = (id) => {
        setOpenDialog(true);
        setAuctionId(id);
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
    }

    const refreshAuctions = () => {
        setReset(!reset);
        setPage(0);
    }

    const [token, setToken] = useState(null);

    getToken(setToken);

    return (
        <Fragment>
            <AuctionGrid auctions={auctions} loading={loading} lastElementRef={lastElementRef} openDetailDialog={openDetailDialog} refreshAuctions={refreshAuctions} token={token}
                emptyMessage="Your search do not return auctions, try another query" />
            <AuctionDialog auctionId={auctionId} open={openDialog} handleClose={handleCloseDialog} />
        </Fragment>
    );
}