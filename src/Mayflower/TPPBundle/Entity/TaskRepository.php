<?php
/**
 * Created by PhpStorm.
 * User: robin
 * Date: 8/27/13
 * Time: 9:49 AM
 */

namespace Mayflower\TPPBundle\Entity;

use Doctrine\ORM\EntityRepository;

class TaskRepository extends EntityRepository
{

    public function findByWeeks(\DateTime $week, $weekNum)
    {
        $weekLast = clone $week;
        $weekLast->modify('+'.$weekNum.' weeks');

        return $this->getEntityManager()
            ->createQueryBuilder()
            ->select('t')
            ->from('MayflowerTPPBundle:Task', 't')
            ->where('t.week >= :week')
            ->andWhere('t.week < :weekLast')
            ->setParameter('week', $week)
            ->setParameter('weekLast', $weekLast)
            ->getQuery()
            ->getResult();
    }


} 